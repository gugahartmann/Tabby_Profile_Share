# Security policy

## Supported versions

Security fixes are prioritized for the latest released version of `tabby-profile-share`. Preview builds may change rapidly; no release should be assumed safe without testing.

## Reporting a vulnerability

**Do not open a public issue containing a vulnerability, credential, real network inventory, IP list, customer information, or reproduction file from production.**

Use [GitHub's private vulnerability reporting](https://github.com/gugahartmann/Tabby_Profile_Share/security/advisories/new) if the repository has that feature enabled. If it is not enabled, open a public issue **without sensitive technical details**, asking the maintainer to establish a private contact channel before sharing evidence.

Include a reproduction using **synthetic SSH profiles only**, affected plugin/Tabby versions, and potential impact. Do not send passwords, SSH private keys or corporate configuration exports.

## Data model and threat boundaries

- Export includes device names, SSH hosts/IPs, allowed SSH options, folder names, and only explicitly selected usernames. It is **network inventory**, even if it contains no passwords.
- The exporter uses an **allowlist**. It never intentionally serializes Tabby configuration, Vault secrets, login scripts, password fields, private key paths or proxy commands.
- The importer validates the package before building new profiles; arbitrary JSON options and scripts are rejected.
- Import does **not** connect to devices or execute scripts. Incoming data is still untrusted.
- User-provided profile names, hostnames or notes should never be treated as commands. Preview the import before accepting it.
- Keep a backup before import. No recovery guarantee is offered for storage failures or app crashes during persistence.
- Do not commit production exports to source control.

Security fixes should add regression tests to `test/shareCore.test.js` before release.
