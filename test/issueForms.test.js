const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const issueDir = path.join(__dirname, '../.github/ISSUE_TEMPLATE')
const forms = [
    ['01-bug-report.yml', 'Bug Report', ['plugin-version', 'tabby-version', 'operating-system', 'reproduce', 'expected']],
    ['02-feature-request.yml', 'Feature Request', ['feature-area', 'problem', 'expected']],
    ['03-custom.yml', 'Custom / Question', ['topic', 'details', 'privacy']],
]

for (const [filename, title, requiredIds] of forms) {
    test('issue form ' + filename + ' exposes structured fields and privacy guidance', () => {
        const yaml = fs.readFileSync(path.join(issueDir, filename), 'utf8')
        assert.match(yaml, /^name: ".+"$/m)
        assert.ok(yaml.includes(title))
        assert.match(yaml, /^description: ".+"$/m)
        assert.match(yaml, /^title: "\[[^\]]+\]: "$/m)
        assert.match(yaml, /^body:$/m)
        assert.match(yaml, /^  - type: markdown$/m)
        assert.match(yaml, /required: true/)
        const ids = [...yaml.matchAll(/^    id: ([a-z][a-z0-9-]*)$/gm)].map(x => x[1])
        assert.equal(ids.length, new Set(ids).size, 'duplicate field IDs')
        for (const id of requiredIds) assert.ok(ids.includes(id), id + ' missing')
        assert.match(yaml, /(?:secret|credential|password|private|sensitive|IP)/i)
    })
}

test('issue chooser exposes only the three supported forms and security help', () => {
    const config = fs.readFileSync(path.join(issueDir, 'config.yml'), 'utf8')
    assert.match(config, /^blank_issues_enabled: false$/m)
    assert.match(config, /SECURITY\.md/)
    const files = fs.readdirSync(issueDir).filter(f => /\.ya?ml$/.test(f))
    assert.deepEqual(files.sort(), ['01-bug-report.yml','02-feature-request.yml','03-custom.yml','config.yml'].sort())
})
