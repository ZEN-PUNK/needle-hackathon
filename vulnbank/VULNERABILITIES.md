# VULNERABILITIES

This file documents intentionally introduced vulnerabilities for scanner validation.

## VULN-001
- Type: SQL Injection
- Location: `server/index.js` (`/api/register`, `/api/login`, `/api/transfer`)
- CWE: CWE-89
- Severity: Critical
- Description: SQL statements are constructed via string concatenation with untrusted input.

## VULN-002
- Type: Hardcoded Secret (JWT)
- Location: `server/config.js`
- CWE: CWE-798
- Severity: High
- Description: JWT secret is hardcoded in source.

## VULN-003
- Type: Exposed Secret in Version Control
- Location: `.env`
- CWE: CWE-200
- Severity: High
- Description: Secrets are intentionally committed to repository.

## VULN-004
- Type: Plaintext Password Storage
- Location: `server/index.js` (`/api/register`)
- CWE: CWE-256
- Severity: Critical
- Description: Passwords are stored in plaintext without hashing.

## VULN-005
- Type: JWT Missing Expiration
- Location: `server/index.js` (`/api/login`)
- CWE: CWE-613
- Severity: High
- Description: JWT tokens are issued without expiration (`exp`).

## VULN-006
- Type: Broken Access Control (Admin Endpoint)
- Location: `server/index.js` (`/api/admin/users`)
- CWE: CWE-862
- Severity: Critical
- Description: Admin endpoint lacks role verification and is unauthenticated.

## VULN-007
- Type: Broken Access Control (IDOR)
- Location: `server/index.js` (`/api/transactions/:userId`)
- CWE: CWE-639
- Severity: High
- Description: Any authenticated user can request another user's transaction history by changing path ID.

## VULN-008
- Type: Insecure CORS Configuration
- Location: `server/index.js`
- CWE: CWE-942
- Severity: Medium
- Description: CORS is configured with wildcard origin (`*`).

## VULN-009
- Type: Information Exposure Through Debug Errors
- Location: `server/index.js` error handler
- CWE: CWE-209
- Severity: Medium
- Description: API responses leak stack traces and raw error details.

## VULN-010
- Type: Cross-Site Scripting (XSS)
- Location: `client/src/pages/DashboardPage.jsx`
- CWE: CWE-79
- Severity: High
- Description: Unsanitized user-provided notes are rendered via `dangerouslySetInnerHTML`.

## VULN-011
- Type: Insecure/Outdated Dependency
- Location: `server/package.json`
- CWE: CWE-1104
- Severity: Medium
- Description: Includes intentionally old `lodash@4.17.15` for demonstration.

## VULN-012
- Type: Hardcoded Fake Cloud Credential
- Location: `server/config.js`
- CWE: CWE-798
- Severity: Medium
- Description: Fake AWS-style access key is embedded in source for scanner detection.
