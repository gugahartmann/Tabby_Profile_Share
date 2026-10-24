'use strict'

// Pure, dependency-free data format. Deliberately NO raw profile/config serialization.
const FORMAT = 'tabby-profile-share'
const VERSION = 1
const MAX_PROFILES = 10000
const MAX_GROUPS = 4000
const MAX_BYTES = 5 * 1024 * 1024
const algorithmKeys = ['hmac', 'kex', 'cipher', 'serverHostKey', 'compression']
const authMethods = [null, 'password', 'publicKey', 'agent', 'keyboardInteractive']
const allowedOptions = new Set([
    'host', 'port', 'user', 'auth', 'algorithms', 'jumpHost',
    'keepaliveInterval', 'keepaliveCountMax', 'readyTimeout',
    'x11', 'skipBanner', 'reuseSession', 'warnOnClose', 'term',
])
const allowedProfile = new Set(['id', 'type', 'name', 'group', 'icon', 'color', 'options'])
const allowedGroup = new Set(['id', 'name', 'parentGroupId', 'icon', 'color'])

function plain (v) { return !!v && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype }
function text (v, max = 512) { return typeof v === 'string' && v.length <= max }
function integer (v, min, max) { return Number.isInteger(v) && v >= min && v <= max }
function assert (value, message) { if (!value) throw new Error(message) }
function optionalString (v, max = 512) { return v === undefined || v === null || text(v, max) }
function basic (src, dst, key, predicate) {
    if (Object.prototype.hasOwnProperty.call(src, key) && predicate(src[key])) dst[key] = src[key]
}

// The allowlist is the SECURITY BOUNDARY. No password, key, login script, proxyCommand,
// forwarded port, filesystem path, arbitrary option or inherited defaults leave the app.
function safeOptions (src, includeUser) {
    src = plain(src) ? src : {}
    const dst = {}
    basic(src, dst, 'host', v => text(v, 255) && !!v.trim())
    basic(src, dst, 'port', v => integer(v, 1, 65535))
    dst.user = includeUser && text(src.user, 255) ? src.user : ''
    basic(src, dst, 'auth', v => authMethods.includes(v))
    for (const key of ['keepaliveInterval', 'keepaliveCountMax', 'readyTimeout']) {
        basic(src, dst, key, v => v === null || integer(v, 0, 2147483647))
    }
    for (const key of ['x11', 'skipBanner', 'reuseSession']) basic(src, dst, key, v => typeof v === 'boolean')
    basic(src, dst, 'warnOnClose', v => v === null || typeof v === 'boolean')
    basic(src, dst, 'term', v => text(v, 80))
    if (plain(src.algorithms)) {
        const algorithms = {}
        for (const key of algorithmKeys) {
            if (Array.isArray(src.algorithms[key])) {
                algorithms[key] = src.algorithms[key].filter(v => text(v, 128) && /^[A-Za-z0-9@_.+,-]+$/.test(v)).slice(0, 64)
            }
        }
        if (Object.keys(algorithms).length) dst.algorithms = algorithms
    }
    // jumpHost is resolved exclusively against selected profile IDs in createPackage.
    return dst
}

function uniqueUsers (profiles) {
    const counts = new Map()
    for (const p of profiles) {
        const user = p.options?.user
        if (typeof user === 'string' && user.trim()) counts.set(user, (counts.get(user) || 0) + 1)
    }
    return Array.from(counts, ([user, count]) => ({ user, count })).sort((a, b) => a.user.localeCompare(b.user))
}

function createPackage (profiles, groups, selectedIds, sharedUsers) {
    assert(Array.isArray(profiles) && Array.isArray(groups), 'Invalid Tabby data')
    const included = profiles.filter(p => p.type === 'ssh' && selectedIds.has(p.id))
    assert(included.length > 0, 'Select at least one SSH profile')
    assert(included.length <= MAX_PROFILES, 'Too many profiles')
    const groupsById = new Map(groups.map(g => [g.id, g]))
    const used = new Set()
    for (const p of included) {
        let groupId = p.group
        const seen = new Set()
        while (groupId && groupsById.has(groupId)) {
            assert(!seen.has(groupId), 'A folder cycle was found')
            seen.add(groupId)
            used.add(groupId)
            groupId = groupsById.get(groupId).parentGroupId
        }
    }
    assert(used.size <= MAX_GROUPS, 'Too many folders')
    const selectedGroups = groups.filter(g => used.has(g.id))
    const groupIds = new Map(selectedGroups.map((g, i) => [g.id, 'g' + (i + 1)]))
    const profileIds = new Map(included.map((p, i) => [p.id, 'p' + (i + 1)]))
    const resultGroups = selectedGroups.map(g => {
        assert(text(g.name) && !!g.name.trim(), 'Invalid folder name')
        const entry = { id: groupIds.get(g.id), name: g.name }
        if (groupIds.has(g.parentGroupId)) entry.parentGroupId = groupIds.get(g.parentGroupId)
        if (text(g.icon, 128)) entry.icon = g.icon
        if (text(g.color, 128)) entry.color = g.color
        return entry
    })
    const resultProfiles = included.map(p => {
        assert(text(p.name) && !!p.name.trim(), 'Invalid profile name')
        const options = safeOptions(p.options, sharedUsers.has(p.options?.user))
        assert(options.host, 'SSH host is missing: ' + p.name)
        if (profileIds.has(p.options?.jumpHost)) options.jumpHost = profileIds.get(p.options.jumpHost)
        const entry = { id: profileIds.get(p.id), type: 'ssh', name: p.name, options }
        if (groupIds.has(p.group)) entry.group = groupIds.get(p.group)
        if (text(p.icon, 128)) entry.icon = p.icon
        if (text(p.color, 128)) entry.color = p.color
        return entry
    })
    return { format: FORMAT, formatVersion: VERSION, groups: resultGroups, profiles: resultProfiles }
}

function parsePackage (raw) {
    assert(typeof raw === 'string' && raw.length <= MAX_BYTES, 'File exceeds 5 MB or is not text')
    let data
    try { data = JSON.parse(raw) } catch { throw new Error('Invalid JSON file') }
    assert(plain(data) && data.format === FORMAT && data.formatVersion === VERSION, 'Unsupported Profile Share format/version')
    assert(Array.isArray(data.groups) && data.groups.length <= MAX_GROUPS, 'Invalid folder count')
    assert(Array.isArray(data.profiles) && data.profiles.length > 0 && data.profiles.length <= MAX_PROFILES, 'Invalid SSH profile count')
    const groupIds = new Set()
    for (const g of data.groups) {
        assert(plain(g) && Object.keys(g).every(k => allowedGroup.has(k)), 'Unknown folder field')
        assert(text(g.id, 100) && !!g.id && !groupIds.has(g.id), 'Duplicate/invalid folder ID')
        assert(text(g.name) && !!g.name.trim(), 'Invalid folder name')
        assert(optionalString(g.parentGroupId, 100) && optionalString(g.icon, 128) && optionalString(g.color, 128), 'Invalid folder metadata')
        groupIds.add(g.id)
    }
    const byId = new Map(data.groups.map(g => [g.id, g]))
    for (const g of data.groups) {
        if (g.parentGroupId !== undefined) assert(groupIds.has(g.parentGroupId), 'Folder parent missing')
        const path = new Set()
        let current = g
        while (current) {
            assert(!path.has(current.id), 'Folder cycle detected')
            path.add(current.id)
            current = byId.get(current.parentGroupId)
        }
    }
    const profileIds = new Set()
    for (const p of data.profiles) {
        assert(plain(p) && Object.keys(p).every(k => allowedProfile.has(k)), 'Unknown profile field')
        assert(text(p.id, 100) && !!p.id && !profileIds.has(p.id), 'Duplicate/invalid profile ID')
        assert(p.type === 'ssh' && text(p.name) && !!p.name.trim(), 'Only SSH profiles are supported')
        assert(p.group === undefined || groupIds.has(p.group), 'Profile folder missing')
        assert(optionalString(p.icon, 128) && optionalString(p.color, 128), 'Invalid profile metadata')
        assert(plain(p.options) && Object.keys(p.options).every(k => allowedOptions.has(k)), 'Unsafe/unknown SSH option')
        assert(text(p.options.host, 255) && !!p.options.host.trim(), 'Invalid SSH hostname')
        assert(p.options.user === undefined || text(p.options.user, 255), 'Invalid SSH username')
        const normalized = safeOptions(p.options, true)
        for (const k of Object.keys(p.options)) {
            if (k !== 'jumpHost') assert(JSON.stringify(p.options[k]) === JSON.stringify(normalized[k]), 'Invalid SSH option: ' + k)
        }
        if (p.options.jumpHost !== undefined) assert(text(p.options.jumpHost, 100), 'Invalid jump-host ID')
        profileIds.add(p.id)
    }
    for (const p of data.profiles) {
        if (p.options.jumpHost) assert(profileIds.has(p.options.jumpHost), 'Referenced jump host not included')
    }
    return data
}

function buildImportPlan (data, username, idFactory) {
    assert(plain(data) && typeof idFactory === 'function', 'Invalid import plan')
    const groupMap = new Map(data.groups.map(g => [g.id, idFactory()]))
    const profileMap = new Map(data.profiles.map(p => [p.id, 'ssh:custom:shared:' + idFactory()]))
    // Only prepare a plan from already validated packages.
    const groups = data.groups.map(g => ({
        id: groupMap.get(g.id), name: g.name,
        ...(g.parentGroupId ? { parentGroupId: groupMap.get(g.parentGroupId) } : {}),
        ...(g.icon ? { icon: g.icon } : {}), ...(g.color ? { color: g.color } : {}),
    }))
    const profiles = data.profiles.map(p => {
        const options = safeOptions(p.options, true)
        if (!options.user && username) options.user = username
        if (p.options.jumpHost) options.jumpHost = profileMap.get(p.options.jumpHost)
        return {
            id: profileMap.get(p.id), type: 'ssh', name: p.name,
            ...(p.group ? { group: groupMap.get(p.group) } : {}),
            ...(p.icon ? { icon: p.icon } : {}), ...(p.color ? { color: p.color } : {}),
            options,
        }
    })
    return { groups, profiles }
}

module.exports = { FORMAT, VERSION, MAX_BYTES, uniqueUsers, safeOptions, createPackage, parsePackage, buildImportPlan }
