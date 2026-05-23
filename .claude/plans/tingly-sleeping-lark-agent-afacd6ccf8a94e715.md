# Implementation Plan: SolutionView Inline Editing, Direct Publish, and Comments System

## Overview

Five features to implement:
1. Remove Edit button from SolutionView
2. Inline title editing for solutions
3. Inline notes editing for solutions
4. Publish as private by default (skip SolutionEditor)
5. Comments system below solutions

---

## Feature 1: Remove Edit Button from SolutionView

**File:** `src/components/SolutionView.tsx`

### Changes
- Delete lines 113-118 (the Edit button `<button onClick={() => setEditing(true)}>Edit</button>`)
- Remove the `editing` state on line 19: `const [editing, setEditing] = useState(false)`
- Remove the entire `if (editing)` block (lines 57-77) that renders `SolutionEditor`
- Remove the `SolutionEditor` import on line 8

**Why:** The Edit button is being replaced by inline editing of title and notes. The SolutionEditor component is no longer needed from SolutionView once inline editing is in place.

---

## Feature 2: Inline Title Editing for Solutions

**File:** `src/components/SolutionView.tsx`

### Reference Pattern
`SubmissionView.tsx` lines 144-182 demonstrate the exact pattern:
- `editingName` boolean state
- `nameValue` string state initialized from current name
- When not editing: a `<button>` that looks like text, with `onClick` to enter edit mode
- When editing: an `<input>` with `onKeyDown` handler for Enter (save) and Escape (cancel), plus Save/Cancel buttons

### Changes

1. **Add state variables** (near top of component):
   ```ts
   const [editingTitle, setEditingTitle] = useState(false);
   const [titleValue, setTitleValue] = useState(sol.title || "");
   ```

2. **Add save handler:**
   ```ts
   const handleTitleSave = async () => {
     const supabase = createClient();
     const { error } = await supabase
       .from("solutions")
       .update({ title: titleValue || "Untitled Solution", updated_at: new Date().toISOString() })
       .eq("id", sol.id);
     if (!error) {
       onUpdated();
     }
     setEditingTitle(false);
   };
   ```

3. **Replace static h2** (lines 137-139) with conditional rendering:
   - If `isOwner && editingTitle`: render input + Save/Cancel (same pattern as SubmissionView)
   - If `isOwner && !editingTitle`: render clickable button styled as h2, with `title="Click to rename"`
   - If `!isOwner`: render the static h2 as-is

---

## Feature 3: Inline Notes Editing for Solutions

**File:** `src/components/SolutionView.tsx`

### Reference Pattern
`SubmissionView.tsx` lines 213-261:
- `notesEditing` boolean state, `notes` string state
- When not editing and notes exist: clickable `<div>` with `cursor-pointer hover:border-accent/50`
- When editing or no notes: textarea + Save/Cancel buttons
- Save handler updates via Supabase

### Changes

1. **Add state variables:**
   ```ts
   const [notesEditing, setNotesEditing] = useState(false);
   const [notesValue, setNotesValue] = useState(sol.content || "");
   const [notesSaving, setNotesSaving] = useState(false);
   const [notesSaveError, setNotesSaveError] = useState<string | null>(null);
   ```

2. **Add save handler:**
   ```ts
   const handleNotesSave = async () => {
     setNotesSaving(true);
     setNotesSaveError(null);
     const supabase = createClient();
     const { error } = await supabase
       .from("solutions")
       .update({ content: notesValue || "", updated_at: new Date().toISOString() })
       .eq("id", sol.id);
     if (error) {
       setNotesSaveError(error.message);
     } else {
       setNotesEditing(false);
       onUpdated();
     }
     setNotesSaving(false);
   };
   ```

3. **Replace the notes section** (lines 190-199) with conditional rendering:
   - If `isOwner && (notesEditing || !sol.content)`: textarea with markdown placeholder, Save/Cancel buttons, error display
   - If `isOwner && !notesEditing && sol.content`: clickable div wrapping `MarkdownRenderer`, `title="Click to edit notes"`
   - If `!isOwner && sol.content`: render MarkdownRenderer as-is (read-only)
   - If `!isOwner && !sol.content`: "No notes provided." text

---

## Feature 4: Publish as Private by Default

**File:** `src/components/SubmissionView.tsx`

### Current Behavior
Lines 108-116: The "Publish" button sets `showSolutionEditor(true)`, which renders the full `SolutionEditor` form.

### New Behavior
Click "Publish" -> directly insert a private solution -> redirect to the solution view page.

### Changes

1. **Replace `showSolutionEditor` state and related code.** Add a `publishing` state instead:
   ```ts
   const [publishing, setPublishing] = useState(false);
   const [publishError, setPublishError] = useState<string | null>(null);
   ```

2. **Add direct publish handler:**
   ```ts
   const handlePublish = async () => {
     if (!user) return;
     setPublishing(true);
     setPublishError(null);
     const supabase = createClient();
     const { data, error } = await supabase
       .from("solutions")
       .insert({
         user_id: user.id,
         problem_id: problemId,
         submission_id: sub.id,
         title: sub.name || "Untitled Solution",
         content: sub.notes || "",
         is_public: false,
         tags: [],
       })
       .select("id")
       .single();
     if (error) {
       setPublishError(error.message);
       setPublishing(false);
       return;
     }
     setPublishing(false);
     // Navigate to the solution view
     // Use window.location to navigate to the solutions tab with the new solution ID
     const slug = window.location.pathname.split("/problems/")[1]?.split("/")[0];
     if (slug && data?.id) {
       window.location.href = `/problems/${slug}/solutions?id=${data.id}`;
     }
   };
   ```

3. **Update the Publish button** (lines 108-116): Change `onClick={() => setShowSolutionEditor(true)}` to `onClick={handlePublish}`, disable while `publishing`, show "Publishing..." text.

4. **Remove the SolutionEditor conditional** (lines 79-88) and the `showSolutionEditor` state (line 31).

5. **Remove the `SolutionEditor` import** (line 7) since it is no longer used.

6. **Show publishError** if set, as a small error message near the button area.

### Navigation Consideration
The current `SolutionsTab` already supports `?id=<uuid>` in the URL (see `pendingSolutionIdRef` in `SolutionsTab.tsx` lines 22-26). Using `window.location.href` will cause a full page load that lands on the solutions tab with the new solution pre-selected, which matches the existing pattern perfectly.

---

## Feature 5: Comments System

This is the largest feature. It requires a database migration, new types, and a new component.

### Step 5a: Database Migration

**New file:** `supabase/migrations/007_comments.sql`

Following the idempotent pattern from `003_solutions.sql`:

```sql
-- ============================================
-- Comments & Comment Likes Migration
-- ============================================

-- Solution comments table
CREATE TABLE IF NOT EXISTS public.solution_comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  solution_id uuid REFERENCES public.solutions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES public.solution_comments(id) ON DELETE CASCADE,
  reply_to_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  content text NOT NULL DEFAULT '',
  is_edited boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Comment likes table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  comment_id uuid REFERENCES public.solution_comments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (comment_id, user_id)
);

-- RLS: solution_comments
ALTER TABLE public.solution_comments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Comments viewable by everyone"
    ON public.solution_comments FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own comments"
    ON public.solution_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own comments"
    ON public.solution_comments FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own comments"
    ON public.solution_comments FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RLS: comment_likes
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Comment likes viewable by everyone"
    ON public.comment_likes FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own comment likes"
    ON public.comment_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own comment likes"
    ON public.comment_likes FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_solution_comments_solution_id ON public.solution_comments(solution_id);
CREATE INDEX IF NOT EXISTS idx_solution_comments_parent_id ON public.solution_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON public.comment_likes(comment_id);
```

**Design decisions:**
- `parent_id` is nullable: top-level comments have `parent_id = NULL`, replies point to the top-level comment
- `reply_to_user_id` stores who is being replied to in nested replies (for the @username prefix display)
- Nested replies (reply to reply) are stored flat under the parent: `parent_id` always points to the root comment, not the intermediate reply. This keeps queries simple (one level of nesting).
- Comments are publicly readable (they are on public solutions). RLS restricts writes to the comment owner.
- `ON DELETE CASCADE` on `parent_id` ensures deleting a top-level comment removes all replies.

### Step 5b: TypeScript Types

**File:** `src/lib/types.ts`

Add these types:

```ts
export interface Comment {
  id: string;
  solution_id: string;
  user_id: string;
  parent_id: string | null;
  reply_to_user_id: string | null;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommentWithMeta extends Comment {
  like_count: number;
  user_has_liked: boolean;
  profiles: { full_name: string | null; avatar_url: string | null; email: string | null };
  reply_to_username?: string | null;  // resolved from reply_to_user_id
  replies?: CommentWithMeta[];        // populated client-side for top-level comments
}
```

### Step 5c: CommentsSection Component

**New file:** `src/components/CommentsSection.tsx`

This is a self-contained component that handles all comment functionality.

#### Props
```ts
interface CommentsSectionProps {
  solutionId: string;
}
```

#### Data Fetching Strategy
1. Fetch all `solution_comments` for the given `solution_id`, ordered by `created_at ASC`
2. Fetch profiles for all unique `user_id` values (and `reply_to_user_id` values)
3. Fetch all `comment_likes` for the fetched comment IDs
4. Client-side: group replies under their parent, compute like counts, build `CommentWithMeta[]`

#### Component Structure

```
CommentsSection
├── Comment count header ("N Comments")
├── New comment textarea + Submit button (if logged in)
├── Top-level comments list (parent_id = null), ordered by created_at
│   └── SingleComment (for each top-level comment)
│       ├── Avatar + username + timestamp + (edited label)
│       ├── Content text
│       ├── Action bar: Like button (count) | Reply button | Edit button (if owner)
│       ├── Reply input (if replying, shown inline)
│       ├── Replies list (initially show first 3, "Show N more replies" button)
│       │   └── SingleComment (for each reply)
│       │       ├── @username prefix (from reply_to_username)
│       │       ├── Same structure minus nested replies
│       │       └── "Reply" button -> sets reply state on parent with reply_to_user_id
│       └── "Show more replies" button
└── (optional) "Load more comments" for large threads
```

#### Key State
```ts
const [comments, setComments] = useState<CommentWithMeta[]>([]);  // top-level only, replies nested
const [loading, setLoading] = useState(true);
const [newComment, setNewComment] = useState("");
const [submitting, setSubmitting] = useState(false);
const [replyingTo, setReplyingTo] = useState<{ parentId: string; replyToUserId?: string; replyToUsername?: string } | null>(null);
const [replyText, setReplyText] = useState("");
const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
const [editText, setEditText] = useState("");
const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());  // parent IDs with expanded replies
```

#### Key Handlers

**Post new comment:**
```ts
const handlePostComment = async () => {
  // Insert into solution_comments with parent_id=null, reply_to_user_id=null
  // Refresh comments
};
```

**Post reply:**
```ts
const handlePostReply = async (parentId: string, replyToUserId?: string) => {
  // Insert into solution_comments with parent_id, reply_to_user_id
  // Always set parent_id to the TOP-LEVEL comment (not intermediate reply)
  // Refresh comments, auto-expand replies for this parent
};
```

**Like/unlike comment:**
```ts
const handleLikeComment = async (commentId: string) => {
  // Same optimistic pattern as solution likes in SolutionsTab.tsx
  // Toggle insert/delete on comment_likes
};
```

**Edit comment:**
```ts
const handleEditComment = async (commentId: string) => {
  // Update content, set is_edited=true, update updated_at
  // Refresh comments
};
```

**Reply to a reply (nested):**
When user clicks "Reply" on a reply (not top-level), set `replyingTo` with:
- `parentId` = the top-level parent's ID (so the new reply is stored flat)
- `replyToUserId` = the reply author's user_id (for the @mention)
- `replyToUsername` = resolved username for display in the textarea placeholder

#### "Show more" for replies
- Initially display first 3 replies per parent
- If more exist, show "Show N more replies" button
- Clicking adds `parentId` to `expandedReplies` set, showing all

#### Timestamps
Use relative time for recent comments (e.g., "2 hours ago", "yesterday") and absolute date for older ones. A simple helper function:
```ts
function formatCommentTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
```

#### Edited label
If `is_edited` is true, display "(edited)" next to the timestamp, with a `title` attribute showing the `updated_at` date.

### Step 5d: Integration into SolutionView

**File:** `src/components/SolutionView.tsx`

Add at the bottom of the component's return JSX, after the date section (line 210):

```tsx
{/* Comments */}
<CommentsSection solutionId={sol.id} />
```

Import the new component at the top of the file.

---

## Implementation Order

Recommended sequence for minimal conflicts:

1. **Migration first** (`007_comments.sql`) - no code dependencies
2. **Types** (`types.ts`) - add Comment/CommentWithMeta, no breakage
3. **Feature 1 + 2 + 3 together** (SolutionView.tsx) - remove Edit button, add inline title editing, add inline notes editing. These are all changes to the same file and naturally belong together.
4. **Feature 4** (SubmissionView.tsx) - change Publish flow. Independent of SolutionView changes.
5. **Feature 5** - CommentsSection.tsx (new file), then integrate into SolutionView.tsx

Steps 1-2 can be done in parallel. Steps 3-4 can be done in parallel. Step 5 depends on steps 1-2.

---

## Potential Challenges

1. **Stale data after inline edits in SolutionView:** The `onUpdated` callback calls `fetchSolutions()` in `SolutionsTab`, but the `viewingSolution` state is a snapshot. After an inline edit, the parent re-fetches but the `SolutionView` still holds the old `sol` prop. The `SolutionView` needs to either receive refreshed data via prop updates or manage its own local state for edited fields. The simplest approach: use local state for `titleValue` and `notesValue` that update optimistically, and still call `onUpdated()` to sync the parent list.

2. **Publish redirect with slug extraction:** The `handlePublish` in SubmissionView needs the problem slug for the redirect URL. Currently `SubmissionView` only receives `problemId` (UUID), not the slug. Options:
   - Extract slug from `window.location.pathname` (already contains `/problems/{slug}/...`)
   - Add `problemSlug` as a new prop from the parent `SubmissionsList`
   
   Extracting from `window.location.pathname` is simpler and avoids prop drilling. The URL structure is reliable.

3. **Comment count performance:** Fetching all comments, profiles, and likes in one go is fine for typical thread sizes (under 100 comments). For very large threads, pagination could be added later. Initial implementation should fetch all and paginate client-side with "show more."

4. **Nested reply flattening:** The key invariant is that `parent_id` always points to a top-level comment (never to another reply). This must be enforced in the `handlePostReply` logic. If someone replies to a reply, find that reply's `parent_id` and use it.

---

## Files Summary

### Modified Files
| File | Changes |
|------|---------|
| `src/components/SolutionView.tsx` | Remove Edit button, remove SolutionEditor import, add inline title editing, add inline notes editing, add CommentsSection |
| `src/components/SubmissionView.tsx` | Replace SolutionEditor-based publish with direct insert + redirect, remove SolutionEditor import |
| `src/lib/types.ts` | Add `Comment` and `CommentWithMeta` interfaces |

### New Files
| File | Purpose |
|------|---------|
| `supabase/migrations/007_comments.sql` | Create `solution_comments` and `comment_likes` tables with RLS |
| `src/components/CommentsSection.tsx` | Full comments UI component |

### Potentially Removable
| File | Reason |
|------|--------|
| `src/components/SolutionEditor.tsx` | After these changes, nothing imports it. Confirm with a codebase search before deleting. If any other component still imports it, keep it. |
