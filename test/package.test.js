const { test } = require('node:test')
const assert = require('node:assert/strict')
const manifest = require('../package.json')

test('manifest can be discovered by the official Tabby plugin scanner', () => {
    // Matches app/src/plugins.ts discovery preconditions.
    assert.match(manifest.name, /^tabby-/)
    assert.ok(manifest.keywords.includes('tabby-plugin'))
    assert.equal(typeof manifest.main, 'string')
    assert.ok(manifest.main.startsWith('dist/'))
    // Tabby reads author.name unconditionally (no optional chaining).
    const author = manifest.author
    const name = author.name || author
    assert.equal(typeof name, 'string')
    assert.ok(name.trim())
    assert.ok(!manifest.name.includes('performance'))
})

test('public distribution metadata is complete', () => {
    const fs = require('node:fs')
    assert.equal(manifest.private, undefined, 'public package must not be marked private')
    assert.equal(manifest.license, 'MIT')
    assert.equal(manifest.publishConfig.access, 'public')
    assert.match(manifest.repository.url, /github\.com\/gugahartmann\/Tabby_Profile_Share/)
    assert.ok(fs.readFileSync(require('node:path').join(__dirname, '../LICENSE'), 'utf8').includes('MIT License'))
    assert.ok(manifest.files.includes('dist'))
})

test('plugin does not impose runtime peer dependencies on the shared npm plugin directory', () => {
    // Tabby supplies Angular and Tabby API modules from its own runtime.
    // Older plugins (e.g. tabby-save-output@3.1.0) can leave Angular 4 in
    // the npm-managed plugin tree, while Tabby itself uses Angular 15.
    // npm Arborist must never resolve the host's Angular from this package.
    assert.deepEqual(manifest.peerDependencies ?? {}, {})
    assert.deepEqual(manifest.dependencies ?? {}, {})
    assert.ok(manifest.devDependencies['@angular/core'].startsWith('^15.'))
    assert.ok(manifest.devDependencies['tabby-core'])
    assert.ok(manifest.devDependencies['tabby-settings'])
})
