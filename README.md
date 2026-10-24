# Tabby Profile Share

**Share SSH profiles and their folder hierarchy safely with your team.**

[![CI](https://github.com/gugahartmann/Tabby_Profile_Share/actions/workflows/test.yml/badge.svg)](https://github.com/gugahartmann/Tabby_Profile_Share/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Português (Brasil)](README.pt-BR.md)

Tabby Profile Share is an **independent, community-maintained plugin** for [Tabby by Eugeny](https://github.com/Eugeny/tabby). It does **not** modify Tabby, require the Tabby Performance fork, or have any affiliation with or endorsement from the Tabby maintainers.

> **Status:** Preview 0.1.2 (unpublished) — manual installation and SSH export confirmed by an early tester. Wider compatibility, import scenarios and public npm publication remain separate validation steps. Do not assume all Tabby versions have been tested.

## Features

- Choose **folders, subfolders or individual SSH profiles** using a tree with checkboxes.
- Review distinct SSH usernames from the selected profiles; **all usernames are unchecked by default**. You explicitly choose which shared usernames to include.
- Export a portable, versioned `.tabby-profiles.json` file, preserving group hierarchy, host, SSH port and allowlisted connection settings.
- Exclude **passwords, login scripts, key material and key paths, and proxy commands**. No Vault access or remote sync.
- Import into **new groups and new profiles**, generating new IDs and preserving pre-existing profiles.
- Prompt for an SSH username when imported profiles have no username; display up to four example devices; retain explicitly shared usernames.
- Handle bundled jump-host relationships when both referenced profiles are in the export.

### What is intentionally not shared?

The file contains **no stored credentials**, private key paths or login scripts. Some advanced SSH options are deliberately not portable; these must be configured on the destination machine.

**Important:** Exported profiles still include hostnames, device labels, private IP addresses, and any usernames you deliberately selected. These are potentially sensitive network inventory. Treat the exported file as confidential, and inspect it before sharing it outside your organization.

## Install

### Once the package is available on npm

Open **Tabby → Settings → Plugins**, search for **profile-share**, install `tabby-profile-share`, and restart Tabby if requested. Tabby discovers community plugins distributed with the `tabby-plugin` npm keyword.

**Not yet published to npm:** Until the package appears in npm search, use the preview instructions below. Publishing status should not be inferred from this README.

### Preview: manual install on Windows

1. Download the latest compiled ZIP from [Actions](https://github.com/gugahartmann/Tabby_Profile_Share/actions/workflows/test.yml) (or a future GitHub release).
2. The Actions artifact contains another ZIP with a top-level directory called `tabby-profile-share`. Extract that directory.
3. Close Tabby fully, including the tray icon, and copy the folder to:
   `%APPDATA%\tabby\plugins\node_modules\tabby-profile-share\`
4. Verify that both files exist inside that directory: `package.json` and `dist/index.js`.
5. Restart Tabby and open **Settings → Profile Sharing**.

Do not install the directory one level too high, or nest `tabby-profile-share` twice.

## Use

**Export:** Select the folder tree, review the list of usernames (unchecked by default), explicitly enable only shared/team usernames, then click **Export**. Inspect the resulting JSON before distributing it.

**Import:** Make a backup of your Tabby configuration, open the **Import** tab, select the JSON, review its counts and confirm. The plugin adds new items; it does not replace existing entries. If any imported profiles lack usernames, it asks for one username to apply to those new profiles, or allows you to leave them blank.

See the [functional specification](docs/SPEC.md) for detailed behavior. Import has automated unit coverage, but full UI regression across Tabby releases remains on the roadmap.

## Development

Requirements: Node.js 22 and npm.

```bash
git clone https://github.com/gugahartmann/Tabby_Profile_Share.git
cd Tabby_Profile_Share
npm install --legacy-peer-deps
npm test
npm run build
npm pack --dry-run
```

The production entry point is `dist/index.js`. Angular and Tabby dependencies are external to the generated bundle, loaded by the host Tabby application.

The repository includes CI for unit tests, compilation and packaging. Before a public release, verify the packaged files, audit dependencies, and test import twice on a disposable Tabby configuration.

## Contributing and security

- [Contributing guide](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [Release/publishing guide](docs/PUBLISHING.md)

Avoid committing real SSH exports, company network inventories or credentials in issues, pull requests, tests or screenshots. Report potential vulnerabilities privately using the instructions in `SECURITY.md`.

## License

[MIT](LICENSE) © 2026 gugahartmann and contributors.

Tabby is a separate project, developed and licensed independently by its authors. Tabby Profile Share is a community plugin, **not an official Tabby product**.
