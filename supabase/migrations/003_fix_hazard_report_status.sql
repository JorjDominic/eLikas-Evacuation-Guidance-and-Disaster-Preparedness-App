-- ──────────────────────────────────────────────────────────────────────────────
-- 003 — Fix hazard_reports status enum
-- The application uses 'approved' / 'rejected' but the initial schema
-- constrained status to ('pending', 'reviewing', 'resolved', 'dismissed').
-- This migration aligns the DB constraint with the application code.
-- ──────────────────────────────────────────────────────────────────────────────

alter table hazard_reports
  drop constraint if exists hazard_reports_status_check;

alter table hazard_reports
  add constraint hazard_reports_status_check
  check (status in ('pending', 'approved', 'rejected'));
