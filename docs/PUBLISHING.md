# Publicação do Tabby Profile Share pelo GitHub Actions

This repository uses a **manual staged-publication workflow**: `.github/workflows/publish-npm.yml`.

**No Git, Node.js or npm installation is needed on the maintainer's computer.** All commands run on a GitHub-hosted runner. Every staged release needs a separate maintainer approval with 2FA on npmjs.com.

Publishing a package to the Tabby plugin manager remains an independent **community release**, not an official endorsement by Eugeny. The Tabby package manager discovers npm modules with the `tabby-plugin` keyword: https://github.com/Eugeny/tabby/blob/master/HACKING.md.

## Before publication

- Check the repository is public and only sanitized, open-source-safe data is committed.
- Check the workflow on `main` passed tests and the release version is unique.
- Check the manifest includes `name: tabby-profile-share`, MIT license, `tabby-plugin`, `main: dist/index.js` and `publishConfig.access: public`.
- Read `docs/SECURITY_AUDIT.md` to understand the Angular 15 compatibility advisories.
- Do not attach or commit real .tabby-profiles.json export files. They may expose internal network inventories.
- On npm, enable account 2FA before creating a token.

## Stage the FIRST version from GitHub Actions

Since `tabby-profile-share` is not published yet, a Trusted Publisher relationship cannot be configured until the package exists. Use a **temporary, stage-only granular token** to create the initial staged package; then approve it in the npm web UI. This is safer than giving CI a token that can publish immediately.

1. Open **https://www.npmjs.com/** and sign in. In your profile menu, go to **Access Tokens → Generate New Token**.
2. Use a descriptive name such as `tabby-profile-share-first-stage`.
3. Under **Packages and scopes**, select **Read and write (stage only)** and **All Packages** (the new unscoped package is not available for selection yet). Set **Organizations: No access**.
4. **Do not enable Bypass 2FA**. Choose a short expiry, e.g. 7 days; avoid adding IP allowlists that would block GitHub-hosted runners.
5. Copy the token **once**. Keep it private; do not paste it into a chat, issue, README, workflow YAML or code.
6. In GitHub go to **Repository Settings → Secrets and variables → Actions → New repository secret**:
   - Name: `NPM_STAGE_TOKEN`
   - Value: the token copied from npm
7. Open **GitHub → Actions → Stage npm package → Run workflow**. Select branch **main**:
   - Method: `bootstrap-stage`
   - Confirm version: `tabby-profile-share@0.1.3` (or the exact current `package.json` version).
8. Open the workflow log. A successful job means the version is **staged, not yet public**.
9. On npmjs.com, open **Staged Packages**. Inspect the staged `tabby-profile-share` files. Click **Approve**, then complete npm 2FA. Approval is the actual publication. New packages may have a public `0.0.0-stage` placeholder before approval.
10. Confirm the package page: https://www.npmjs.com/package/tabby-profile-share and test it from Tabby **Settings → Plugins**.

The workflow runs build, tests, production dependency audit and archive inspection **before** staging. It rejects wrong version confirmations, non-main branches and already published versions.

## Switch to tokenless trusted publishing after the first approval

Once the first version is publicly visible:

1. On npmjs.com open **Packages → tabby-profile-share → Settings → Trusted publishing**.
2. Add a new **GitHub Actions** publisher using precisely:
   - GitHub username / organization: `gugahartmann`
   - Repository: `Tabby_Profile_Share`
   - Workflow filename: `publish-npm.yml` (**filename only**, not the full path).
   - Environment name: leave empty (this workflow does not specify one).
   - Allowed actions: **Allow npm stage publish**. Direct `npm publish` is not needed.
3. On future releases, first increment the npm version in `package.json` through the GitHub web editor or a reviewed PR. Then use **Stage npm package → Run workflow → trusted-stage** and enter the new version.
4. Review and **Approve** each stage through npmjs.com with 2FA. OIDC issues short-lived credentials, so no npm publish token is needed.
5. **Delete** the GitHub repository secret `NPM_STAGE_TOKEN` and **revoke** the temporary granular token from your npm Access Tokens settings.
6. Optionally configure npm package **Publishing access → Require two-factor authentication and disallow tokens** for added security after OIDC has been verified.

Important: npm Trusted Publisher settings must complete a first successful trusted stage/publish within **2 days** or the configuration expires. Configure it just before your first `trusted-stage` run. The workflow file must match exactly. Trusted Publisher package provenance is generated automatically for public packages built from public repositories.

## Why there is no automatic release on push

The release workflow is `workflow_dispatch` only. A source commit, PR or successful test run does **not** publish anything. Each run requires a human to enter the exact version and every stage requires an independent npm 2FA approval.

## Troubleshooting

- **Missing NPM_STAGE_TOKEN**: create the repository Actions secret; never paste the token into a public workflow file.
- **403 / E_STAGE_REQUIRED**: the token is stage-only. Use `npm stage publish`, not `npm publish` (our workflow does this).
- **404 / Not Found** for `trusted-stage`: check npm Trusted Publisher owner/repo/workflow name and whether the npm package exists. Running before configuration will fail.
- **Version already exists or is already staged**: do not rerun the same version. Review/reject the pending stage or bump the package version for a new release.
- **No approval button**: check you're signed into the npm owner account, 2FA is active and the package is shown in **Staged Packages**.
- **Angular audit warnings**: see `docs/SECURITY_AUDIT.md`; they belong to development/host runtime compatibility. Production audit is the release gate.

References:
- https://docs.npmjs.com/staged-publishing/
- https://docs.npmjs.com/creating-and-viewing-access-tokens/
- https://docs.npmjs.com/trusted-publishers/
- https://github.com/Eugeny/tabby/blob/master/HACKING.md
