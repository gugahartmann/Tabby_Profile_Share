# Contributing to Tabby Profile Share

Contributions and issue reports are welcome. This is an **independent community plugin**, not part of the Tabby official repository.

## Development

Requires Node.js 22 and npm. Fork this repository, create a feature branch, and run:

```bash
npm install --legacy-peer-deps
npm test
npm run build
npm pack --dry-run
```

Submit a pull request with: rationale, affected Tabby versions, an explanation of SSH export safety, test results, and sanitized screenshots where UI is changed.

## Security checklist for contributors

- Preserve **allowlist-only exports**. New fields require explicit review, test coverage and a privacy rationale.
- Do not add password, vault, credential, private key material/path, login script, unreviewed proxy or agent secrets to exports.
- Reject unexpected fields when parsing imported JSON. Never run scripts or commands from imports.
- Preserve append-only import behavior: existing profiles and groups must never be overwritten.
- Generate new IDs for every import and remap group and jump-host references.
- Never include actual device identifiers, internal IP address lists, customer information, company logos or secrets in test fixtures or screenshots.
- Consider performance with hundreds or thousands of profiles.

## Reporting issues

Include plugin version, Tabby version, operating system, steps to reproduce and sanitized logs. Do not share real `.tabby-profiles.json` exports unless you have replaced all sensitive device names/IPs with fictional examples.

## AI assistance

AI-assisted contributions are welcome. Explain what AI generated or reviewed, and what tests/manual checks you performed. Contributors remain responsible for security, correctness and legal rights to submitted code.

## License of contributions

By submitting a contribution, you agree that it can be distributed under this project's [MIT License](LICENSE). Only submit material you have the right to license.
