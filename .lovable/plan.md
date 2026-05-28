# Auth UX polish

Three small frontend-only changes to the sign-up and sign-in screens.

## 1. Hyperlink "Terms of Use" and "Privacy Policy"
File: `src/pages/auth/SignUpDetails.tsx`

In the terms checkbox label, replace the plain text with `<Link>` elements:
- "Terms of Use" → `/legal/terms` (route already exists via `src/pages/legal/Terms.tsx`)
- "Privacy Policy" → `/legal/privacy` (route already exists via `src/pages/legal/Privacy.tsx`)

Links open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`) so users don't lose form state. Styled with `text-primary underline-offset-2 hover:underline`. Click on the link won't toggle the checkbox (stopPropagation).

## 2. Password reveal toggle
Files: `src/pages/auth/SignUpDetails.tsx`, `src/pages/auth/SignIn.tsx`

Wrap the password `<Input>` in a relative container with a right-aligned button that toggles a local `showPassword` state between `type="password"` and `type="text"`. Uses `Eye` / `EyeOff` icons from `lucide-react`, with `aria-label="Show password" / "Hide password"`. Pure presentation, no logic change.

## 3. "Remember me" on Sign In
File: `src/pages/auth/SignIn.tsx`

Add a `Checkbox` + label "Remember me" on the same row as the "Forgot password?" link (checkbox left, link right).

Behavior: Supabase JS persists sessions in `localStorage` by default (survives browser restarts). When **unchecked**, before calling `signInWithPassword` we move the persisted session to `sessionStorage` so it clears when the browser closes. Implementation: a small helper that, when remember is false, sets `supabase.auth.setSession` storage swap via re-initializing — simplest approach is to, after successful sign-in, if `!remember`, copy the auth token from `localStorage` to `sessionStorage` and remove it from `localStorage`. Default is checked (current behavior preserved).

## Out of scope
- No backend / Supabase config changes.
- No changes to the role picker, OTP, or survey screens.
- No restyling beyond what these additions need.
