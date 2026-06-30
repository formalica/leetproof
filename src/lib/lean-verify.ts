import { LeanMonacoEditor } from 'lean4monaco';
import * as monaco from 'monaco-editor';

export interface VerifyResult {
  valid: boolean;
  error?: string;
}

interface DiagnosticWaitResult {
  received: boolean;
}

function waitForDiagnostics(
  modelUri: monaco.Uri,
  stableMs = 3000,
  timeoutMs = 60000
): Promise<DiagnosticWaitResult> {
  return new Promise((resolve) => {
    let received = false;
    let stableTimer: ReturnType<typeof setTimeout> | null = null;

    const disposable = monaco.editor.onDidChangeMarkers((uris) => {
      if (uris.some((uri) => uri.toString() === modelUri.toString())) {
        received = true;
        if (stableTimer) clearTimeout(stableTimer);
        stableTimer = setTimeout(() => {
          clearTimeout(timeoutTimer);
          disposable.dispose();
          resolve({ received: true });
        }, stableMs);
      }
    });

    const timeoutTimer = setTimeout(() => {
      if (stableTimer) clearTimeout(stableTimer);
      disposable.dispose();
      resolve({ received });
    }, timeoutMs);
  });
}

const SOLUTION_PLACEHOLDER = /\{\{\s*solution\s*\}\}/i;

/**
 * Build the final Lean verification file from a per-problem verifier template
 * and the user's submitted solution code.
 *
 * The merge rules mirror the structure of a Lean file:
 *  1. The user's solution is spliced into the template. If the template
 *     contains a `{{SOLUTION}}` placeholder, the solution replaces it.
 *     Otherwise the solution is inserted right after the template's leading
 *     import header (the first run of blank/comment/`import` lines), and the
 *     remaining template (the `#check`/`#eval` checks) is appended after it.
 *  2. All `import` lines (from both the template and the solution) are hoisted
 *     to the very top and de-duplicated, since Lean requires imports first.
 */
export function buildVerifierCode(template: string, solution: string): string {
  let merged: string;

  if (SOLUTION_PLACEHOLDER.test(template)) {
    merged = template.replace(SOLUTION_PLACEHOLDER, solution);
  } else {
    const lines = template.split('\n');
    let i = 0;
    while (i < lines.length) {
      const t = lines[i].trim();
      if (t === '' || t.startsWith('import ') || t.startsWith('--')) {
        i++;
        continue;
      }
      break;
    }
    const header = lines.slice(0, i).join('\n');
    const rest = lines.slice(i).join('\n');
    merged = `${header}\n${solution}\n\n${rest}`;
  }

  // Hoist all import lines to the top (Lean requires imports before any code).
  const imports: string[] = [];
  const body: string[] = [];
  for (const line of merged.split('\n')) {
    if (/^\s*import\s/.test(line)) {
      const trimmed = line.trim();
      if (!imports.includes(trimmed)) imports.push(trimmed);
    } else {
      body.push(line);
    }
  }

  const header = imports.length > 0 ? imports.join('\n') + '\n\n' : '';
  return header + body.join('\n').replace(/^\n+/, '');
}

/**
 * Build the default verifier code when a problem has no `verifierCode` template.
 * Just compiles the user's solution (prefixed with `import Lean`).
 */
function buildDefaultVerifierCode(solution: string): string {
  return 'import Lean\n\n' + solution + '\n';
}

export async function verifyProof(
  mainEditor: monaco.editor.IStandaloneCodeEditor,
  options?: {
    projectFolder?: string;
    verifierCode?: string;
  }
): Promise<VerifyResult> {
  const mainModel = mainEditor.getModel();
  if (!mainModel) {
    return { valid: false, error: 'No editor model found' };
  }

  const projectFolder = options?.projectFolder ?? 'MathlibDemo';
  const code = mainModel.getValue();

  const verifyCode = options?.verifierCode
    ? buildVerifierCode(options.verifierCode, code)
    : buildDefaultVerifierCode(code);

  const hiddenContainer = document.createElement('div');
  hiddenContainer.style.position = 'fixed';
  hiddenContainer.style.left = '-9999px';
  hiddenContainer.style.top = '-9999px';
  hiddenContainer.style.width = '800px';
  hiddenContainer.style.height = '600px';
  hiddenContainer.style.opacity = '0';
  hiddenContainer.style.pointerEvents = 'none';
  document.body.appendChild(hiddenContainer);

  const verifyEditor = new LeanMonacoEditor();

  try {
    const verifyFileName = `${projectFolder}/verify_submission.lean`;
    await verifyEditor.start(hiddenContainer, verifyFileName, verifyCode);

    const verifyModel = verifyEditor.editor?.getModel();
    if (!verifyModel) {
      return { valid: false, error: 'Failed to create verification editor' };
    }

    const waitResult = await waitForDiagnostics(verifyModel.uri);

    if (!waitResult.received) {
      return { valid: false, error: 'Verification timed out: Lean server did not respond. Please try again.' };
    }

    const markers = monaco.editor.getModelMarkers({ resource: verifyModel.uri });

    const errors = markers.filter(
      (m) => m.severity === monaco.MarkerSeverity.Error
    );
    if (errors.length > 0) {
      return { valid: false, error: `Code has errors: ${errors[0].message}` };
    }

    const sorryWarnings = markers.filter(
      (m) =>
        m.severity === monaco.MarkerSeverity.Warning &&
        m.message.includes('sorry')
    );
    if (sorryWarnings.length > 0) {
      return { valid: false, error: "Proof uses 'sorry'" };
    }

    const hasSorryAx = markers.some(
      (m) =>
        (m.severity === monaco.MarkerSeverity.Info ||
          m.severity === monaco.MarkerSeverity.Warning ||
          m.severity === monaco.MarkerSeverity.Hint) &&
        m.message.includes('sorryAx')
    );
    if (hasSorryAx) {
      return { valid: false, error: 'Proof uses sorry (sorryAx detected in axioms)' };
    }

    return { valid: true };
  } finally {
    verifyEditor.dispose();
    hiddenContainer.remove();
  }
}
