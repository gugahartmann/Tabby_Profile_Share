const { test } = require('node:test')
const assert = require('node:assert/strict')
const core = require('../src/shareCore')
const p = (id, user = 'personal') => ({ id, type: 'ssh', name: id, group: 'child', options: {
    host: id + '.example.com', port: 22, user, password: 'SECRET_PASSWORD', scripts: [{ expect: 'Password:', send: 'SECRET_SCRIPT' }],
    privateKeys: ['/home/private_key'], proxyCommand: 'ssh -p SECRET_PROXY', jumpHost: id === 'dev2' ? 'dev1' : undefined,
    algorithms: { kex: ['curve25519-sha256'], hmac: ['hmac-sha2-256'] },
} })
const source = [p('dev1'), p('dev2', 'team')]
const folders = [{ id: 'root', name: 'Regional', defaults: { ssh: { options: { password: 'SECRET_DEFAULT' } } } }, { id: 'child', name: 'POP', parentGroupId: 'root' }]
const make = (ids = ['dev1','dev2'], users = []) => core.createPackage(source, folders, new Set(ids), new Set(users))
test('export is strictly allowlisted; secrets and login scripts never leave', () => {
    const data = make()
    const json = JSON.stringify(data)
    for (const secret of ['SECRET_PASSWORD', 'SECRET_SCRIPT', 'SECRET_PROXY', 'SECRET_DEFAULT', 'private_key', 'scripts', 'privateKeys', 'password']) {
        assert.equal(json.includes(secret), false, secret)
    }
    assert.equal(data.profiles[0].options.user, '')
    assert.equal(data.profiles[1].options.user, '')
    assert.deepEqual(data.groups.map(g => g.name), ['Regional','POP'])
    assert.equal(data.profiles[1].options.jumpHost, 'p1')
})
test('only selected usernames are copied, deduplicated', () => {
    const data = make(['dev1','dev2'], ['team'])
    assert.equal(data.profiles[0].options.user, '')
    assert.equal(data.profiles[1].options.user, 'team')
    assert.deepEqual(core.uniqueUsers([p('a','team'),p('b','team'),p('c','personal')]), [
        {user:'personal',count:1},{user:'team',count:2},
    ])
})
test('selected leaf only carries ancestors; missing jump host discarded', () => {
    const data = make(['dev2'], ['team'])
    assert.equal(data.profiles.length,1)
    assert.equal(data.profiles[0].options.jumpHost,undefined)
    assert.equal(data.groups[1].parentGroupId,'g1')
})
test('import always creates new IDs and preserves only imported usernames', () => {
    const data = core.parsePackage(JSON.stringify(make(['dev1','dev2'],['team'])))
    let i=0
    const create = ()=>'new'+(++i)
    const first=core.buildImportPlan(data,'operator',create)
    const second=core.buildImportPlan(data,'operator',create)
    assert.equal(first.profiles[0].options.user,'operator')
    assert.equal(first.profiles[1].options.user,'team')
    assert.notEqual(first.groups[0].id,second.groups[0].id)
    assert.notEqual(first.profiles[0].id,second.profiles[0].id)
    assert.equal(first.profiles[1].options.jumpHost,first.profiles[0].id)
})
test('rejects injected options, cycles, duplicate IDs and oversized files', () => {
    const data=make()
    data.profiles[0].options.scripts=[{send:'password'}]
    assert.throws(()=>core.parsePackage(JSON.stringify(data)),/Unsafe/)
    delete data.profiles[0].options.scripts
    data.groups[0].parentGroupId='g2'
    assert.throws(()=>core.parsePackage(JSON.stringify(data)),/cycle/i)
    delete data.groups[0].parentGroupId
    data.profiles[1].id=data.profiles[0].id
    assert.throws(()=>core.parsePackage(JSON.stringify(data)),/Duplicate/)
    assert.throws(()=>core.parsePackage('x'.repeat(core.MAX_BYTES+1)),/5 MB/)
})
test('invalid jump references are rejected', () => {
    const d=make()
    d.profiles[1].options.jumpHost='unknown'
    assert.throws(()=>core.parsePackage(JSON.stringify(d)),/jump host/)
})
