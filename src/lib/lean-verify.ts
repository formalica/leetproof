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

export async function verifyProof(
  mainEditor: monaco.editor.IStandaloneCodeEditor,
  theoremName: string,
  options?: {
    projectFolder?: string;
    theoremType?: string;
    allowedAxioms?: string[];
  }
): Promise<VerifyResult> {
  const mainModel = mainEditor.getModel();
  if (!mainModel) {
    return { valid: false, error: 'No editor model found' };
  }

  const projectFolder = options?.projectFolder ?? 'MathlibDemo';
  const code = mainModel.getValue();

  let verifyCode = 'import Lean\n\n' + code + '\n\n';

  if (options?.theoremType) {
    verifyCode += `#check (${theoremName} : ${options.theoremType})\n\n`;
  }

  const axioms = options?.allowedAxioms ?? [];
  const axiomNames = axioms.map((a) => '``' + a).join(', ');
  verifyCode += `#eval show Lean.Meta.MetaM Unit from do
  let thmName := \`\`${theoremName}
  let used ← Lean.collectAxioms thmName
  if used.contains \`\`sorryAx then
    throwError m!"'{thmName}' proof uses sorry"
  let allowedNames := [${axiomNames}]
  let disallowed := used.filter (fun ax => !allowedNames.contains ax)
  if !disallowed.isEmpty then
    throwError m!"'{thmName}' theorem uses disallowed axioms: {disallowed.toList}"
\n`;

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
