# KodeIn Release Evidence — 2026-08-12

Release candidate commit: `11c2e77` (`fix: complete security and portfolio remediation`)

## Finished

- Hardened auth input validation, password-reset token hashing, neutral reset responses, and provider account-linking settings.
- Replaced process-local auth rate limits with durable database buckets and added the Prisma migration.
- Made code execution fail closed when the runner is not configured; mapped runner failures to explicit API status codes and refunded reserved quota.
- Removed client-verifiable completion sentinels; verification now compares server-side expected results.
- Made progress derive from `Completion` rows, deduplicated backfill logic, and added focused regression tests.
- Enforced battle participant privacy and expiry consistently across actions and state streaming.
- Added portfolio contact delivery with validation, rate limiting, real delivery failure handling, demo-content warnings, lazy 3D scenes, visibility gating, and reduced-motion behavior.
- Removed stale generated Prisma output and scratch files from source control.
- Added CI checks for Prisma validation, strict linting, bounded tests, and the high-severity audit gate.
- Added an npm override for Monaco's pinned `dompurify` dependency; the clean install resolves `dompurify@3.4.13`.

## Verified locally

| Check | Result |
| --- | --- |
| `npm ci --ignore-scripts --prefer-offline --no-audit --no-fund` | PASS |
| `npx prisma generate` | PASS; Prisma Client 7.9.1 generated |
| `npx prisma validate` | PASS; only the existing deprecated `driverAdapters` preview warning remains |
| `npm run check` | PASS |
| Strict lint and typecheck | PASS |
| Bounded Vitest suite | PASS; 22 files, 69 tests |
| Production build | PASS; 26 static pages generated |
| `npm audit --audit-level=high` | PASS; 0 vulnerabilities |
| `git diff --cached --check` before commit | PASS |

## Not finished / deployment gate

- `npx prisma migrate deploy` was not run. The configured database reports four unapplied migrations: `20260719000000_security_integrity`, `20260809040000_password_reset_token`, `20260812000000_hash_password_reset_tokens`, and `20260812010000_rate_limit_buckets`. Apply them only against the approved deployment target.
- Completion backfill code and tests are finished, but the backfill was not executed against a database. Run it after migration review and backup validation.
- Production runner smoke testing was not run. Configure an approved HTTPS `PISTON_BASE_URL` and `PISTON_AUTH_TOKEN`; the application now fails closed when these are absent.
- Contact delivery is not production-ready until `CONTACT_TO_EMAIL`, `RESEND_API_KEY`, and `EMAIL_FROM` are configured. Portfolio data is explicitly marked as demo content.
- Credential rotation, CI execution, deployment, and production smoke tests were not performed from this local checkout.

## Known warnings

- Prisma reports that `driverAdapters` is deprecated as a preview feature. The schema remains valid; remove the preview declaration when the project upgrades its Prisma configuration.
- `npm ci` reports existing deprecation notices for `prebuild-install` and `tsconfck`; they did not fail the release checks.
