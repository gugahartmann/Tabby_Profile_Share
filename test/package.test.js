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
