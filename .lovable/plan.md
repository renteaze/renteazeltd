# Survey notifications + admin acknowledgement

Three additions tied to the existing survey-submission flow.

## 1. Notify admins when a user submits the survey

Extend `supabase/functions/send-survey-email/index.ts` (already runs once per user, idempotent via `survey_email_sent_at`) to, in the same call:

- **In-app notifications** — insert one row into `notifications` for every user with the `admin` role:
  - `type = "survey_submitted"`
  - `title = "New survey submitted"`
  - `body = "{Full name or email} just completed their survey."`
  - `link = "/admin/users?survey=completed&focus={user_id}"`
  - Uses service-role client (RLS bypassed; existing policy blocks user-side inserts and is preserved).
- **Email to admins** — fetch the email of every admin (`user_roles.role = 'admin'` → `profiles.email`) and send one Brevo email per admin: subject "New survey submitted — {full name}", body summarising name, email, phone, preferred contact method, with a link to `/admin/users?survey=completed`. The submitted PDF is attached so admins have the full responses.
- Failures here are caught and logged but don't fail the user-facing send.

No new edge function. `survey_email_sent_at` continues to gate both the user email and the admin fan-out, so retries are safe.

## 2. Surface admin notifications on the admin dashboard

In `src/pages/portal/AdminDashboard.tsx`, add a "Recent activity" card under the stat tiles:

- Reads the latest 10 rows from `notifications` where `user_id = auth.uid()`, ordered by `created_at desc`.
- Each row shows title, body, relative time, an unread dot when `is_read = false`, and a "View" link that navigates to `notification.link`. Clicking marks it read (`update is_read = true`).
- A "Mark all as read" button.
- Lightweight realtime: a Supabase channel subscribed to `INSERT` on `notifications` filtered by `user_id = auth.uid()` so new items appear without refresh.

This uses the existing `notifications` table and existing RLS (users read/update their own rows).

## 3. Admin acknowledgement action

In `src/components/admin/UserDetailDrawer.tsx`, add a small action bar at the top of the drawer (visible only when `profile.survey_completed`):

- Button: **"Send acknowledgement"** (one click, no dialog).
- Disabled and replaced with "Acknowledged {date} by {admin name}" once `survey_acknowledged_at` is set.
- Calls a new edge function `send-survey-acknowledgement` with `{ user_id }`.

New edge function `supabase/functions/send-survey-acknowledgement/index.ts`:

- Authenticated; verifies caller has `admin` role via `has_role(auth.uid(), 'admin')`.
- Loads the target user's profile (name, email, preferred contact method).
- Idempotency: aborts with a clear message if `survey_acknowledged_at` is already set.
- Sends a Brevo email to the user: subject "We've received and reviewed your Renteaze survey", branded HTML body ("Thank you {first name}, our team has reviewed your responses. A Renteaze representative will be in touch shortly via your preferred contact method — {preferred_contact_method}.") plus the existing PropTech footer.
- Inserts a `notifications` row for the user (`type = "survey_acknowledged"`, link to their portal dashboard).
- Updates the profile: `survey_acknowledged_at = now()`, `survey_acknowledged_by = auth.uid()`.

## 4. Schema migration

Add to `profiles`:
- `survey_acknowledged_at timestamptz` (nullable)
- `survey_acknowledged_by uuid` (nullable, no FK to auth.users per project convention)

No new tables, no RLS changes needed. Service-role writes from the edge functions; admins already have `update all profiles` policy for the read-back in the drawer.

## Out of scope

- No changes to the survey form itself or to the PDF generation.
- No bulk "notify all admins of historical submissions" backfill (the existing `EmailBackfill` admin tool already covers backfilling user emails; admin notifications start from this change forward).
- No new notification preferences UI — admins receive these regardless of their personal notification toggles, since they are operational alerts.

## Technical details

- Edge functions are CORS-enabled, use service-role for cross-user writes, and verify caller identity from the JWT (`createClient` with the user's `Authorization` header for the auth check, then a second service-role client for writes).
- Brevo sender stays `admin@renteaze.com` / "Renteaze" (unchanged from current `send-survey-email`).
- `notifications.link` uses in-app paths so the existing admin router handles them.
