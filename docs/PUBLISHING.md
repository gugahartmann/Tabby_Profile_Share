# Releasing to the Tabby Plugin Manager

Tabby Profile Share is a third-party community plugin. Listing it in Tabby's plugin search does not make it a Tabby-maintained product.

The upstream plugin author guide is https://github.com/Eugeny/tabby/blob/master/HACKING.md. Tabby discovers npm packages with the keyword `tabby-plugin`.

## Public GitHub repository checklist

- Audit current files, issues, pull requests and **Git history** before changing visibility. Deleted credentials remain in old commits.
- Do not publish production `.tabby-profiles.json` files, internal network addresses, company-only data or sensitive screenshots.
- Include MIT license, README, SECURITY, CONTRIBUTING, changelog, unit tests and build checks.
- Test export/import with synthetic profiles on a clean official Tabby version, including double import and empty SSH usernames.
- Review `npm audit --omit=dev`, then separately triage development dependency advisories.
- Verify npm package name availability with `npm view tabby-profile-share version`; the GitHub repository does not reserve that name.

Change visibility manually from **GitHub → Settings → General → Danger Zone → Change repository visibility** only after review.

## First npm release

1. Create a verified npm account with publishing access and 2FA.
2. Check `package.json`: name `tabby-profile-share`, version not used before, public package configuration, `license: MIT`, `main: dist/index.js`, `tabby-plugin` keyword, correct repository and author.
3. Update semantic version for the release: `npm version patch --no-git-tag-version`, then review, commit and tag the version.
4. Run `npm install --legacy-peer-deps`, `npm test`, `npm run build` and `npm pack --dry-run`. Verify the tarball contains compiled files and license, not test inventories.
5. Authenticate locally with `npm login` and confirm `npm whoami`.
6. Publish with `npm publish --access public`; complete any required 2FA verification.
7. Verify `npm view tabby-profile-share version`. In Tabby open **Settings → Plugins**, search `profile-share`, install, restart and verify behavior.

A successful npm publication is normally enough for Tabby's automatic plugin search. A pull request to Eugeny/tabby is **not required for discovery**. An upstream README addition, if desired, is a separate proposal subject to maintainer review.

## Later: trusted publishing without persistent npm tokens

After the npm package exists, configure **npm Trusted Publishing** with the GitHub Actions workflow file name, owner `gugahartmann` and repo `Tabby_Profile_Share`.

Use a hosted runner, Node.js 22.14+ and npm 11.5.1+ with `id-token: write`; npm can issue short-lived OIDC publishing credentials and attach provenance to public packages built from public repositories.

Keep publication as a **manual, deliberate step** until trusted publishing has been configured and tested. Do not store permanent npm publish tokens in repository files.

Sources:
- https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages/
- https://docs.npmjs.com/trusted-publishers/
- https://github.com/Eugeny/tabby/blob/master/HACKING.md
