const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const names = [
    'export-overview.png',
    'import-overview.png',
    'import-username-prompt.png',
    'exported-json-example.png',
]
const imagePrefix = 'https://raw.githubusercontent.com/gugahartmann/Tabby_Profile_Share/main/docs/screenshots/'

for (const file of ['README.md', 'README.pt-BR.md']) {
    test(file + ' includes the project tagline and npm-compatible screenshots', () => {
        const readme = fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
        assert.match(readme, /^# Tabby Profile Share\s+\*\*.+SSH.+(?:credentials|credenciais)\./)
        for (const image of names) {
            assert.ok(readme.includes(imagePrefix + image), 'Missing absolute image URL for ' + image)
            assert.ok(fs.existsSync(path.join(__dirname, '..', 'docs', 'screenshots', image)))
        }
        assert.doesNotMatch(readme, /\]\(docs\/screenshots\//)
        assert.doesNotMatch(readme, /## Publish via GitHub Actions|## Publicação pelo GitHub Actions/)
    })
}
