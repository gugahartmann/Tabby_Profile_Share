import { Component } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ConfigService, ProfilesService, PromptModalComponent, PartialProfile, Profile, ProfileGroup, PartialProfileGroup } from 'tabby-core'
const core = require('./shareCore')

interface Node {
    id: string
    name: string
    level: number
    count: number
    expanded: boolean
    selected: boolean
    partial: boolean
    children: Node[]
    profiles: PartialProfile<Profile>[]
}

@Component({ template: require('./share.component.pug') })
export class ProfileShareComponent {
    tab: 'export'|'import' = 'export'
    profiles: PartialProfile<Profile>[] = []
    groups: PartialProfileGroup<ProfileGroup>[] = []
    tree: Node[] = []
    users: Array<{ user: string, count: number }> = []
    selectedIds = new Set<string>()
    sharedUsers = new Set<string>()
    imported: any = null
    importFileName = ''
    importSummary = ''
    error = ''
    info = ''
    busy = false
    preview = ''
    constructor (private profilesService: ProfilesService, private config: ConfigService, private modal: NgbModal) {}

    async ngOnInit (): Promise<void> { await this.reload() }

    async reload (): Promise<void> {
        this.error = ''
        const all = await this.profilesService.getProfiles({ includeBuiltin: false, clone: true })
        this.profiles = all.filter(p => p.type === 'ssh' && !p.isTemplate && !p.isBuiltin)
        this.groups = this.profilesService.getSyncProfileGroups()
        const byParent = new Map<string, PartialProfileGroup<ProfileGroup>[]>()
        const validIds = new Set(this.groups.map(g => g.id))
        for (const group of this.groups) {
            const parent = group.parentGroupId && validIds.has(group.parentGroupId) ? group.parentGroupId : ''
            byParent.set(parent, [...(byParent.get(parent) || []), group])
        }
        const create = (parent: string, depth: number, path: Set<string>): Node[] =>
            (byParent.get(parent) || []).filter(g => !path.has(g.id)).map(g => {
                const children = create(g.id, depth + 1, new Set([...path, g.id]))
                const profiles = this.profiles.filter(p => p.group === g.id)
                return { id: g.id, name: g.name, level: depth, count: profiles.length + children.reduce((n, c) => n + c.count, 0),
                    expanded: depth < 2, selected: false, partial: false, children, profiles }
            })
        this.tree = create('', 0, new Set())
        const ungrouped = this.profiles.filter(p => !p.group || !validIds.has(p.group))
        if (ungrouped.length) this.tree.push({ id: '__ungrouped__', name: 'Ungrouped', level: 0, count: ungrouped.length, expanded: true, selected: false, partial: false, children: [], profiles: ungrouped })
        this.selectedIds.clear()
        this.sharedUsers.clear()
        this.updateUsers()
    }

    visible (nodes: Node[] = this.tree): Node[] {
        const result: Node[] = []
        const visit = (n: Node) => {
            result.push(n)
            if (n.expanded) for (const c of n.children) visit(c)
        }
        nodes.forEach(visit)
        return result
    }
    setNode (node: Node, checked: boolean): void {
        const visit = (n: Node) => {
            for (const p of n.profiles) {
                if (checked) this.selectedIds.add(p.id!)
                else this.selectedIds.delete(p.id!)
            }
            n.children.forEach(visit)
        }
        visit(node)
        this.refreshTree()
    }
    setProfile (profile: PartialProfile<Profile>, checked: boolean): void {
        if (checked) this.selectedIds.add(profile.id!)
        else this.selectedIds.delete(profile.id!)
        this.refreshTree()
    }
    refreshTree (): void {
        const visit = (n: Node): void => {
            n.children.forEach(visit)
            const own = n.profiles.length
            const selected = n.profiles.filter(p => this.selectedIds.has(p.id!)).length
            const fullChildren = n.children.filter(c => c.selected).length
            n.selected = selected === own && fullChildren === n.children.length && (own + n.children.length > 0)
            n.partial = !n.selected && (selected > 0 || fullChildren > 0 || n.children.some(c => c.partial))
        }
        this.tree.forEach(visit)
        this.updateUsers()
    }
    get chosen (): PartialProfile<Profile>[] { return this.profiles.filter(p => this.selectedIds.has(p.id!)) }
    updateUsers (): void {
        this.users = core.uniqueUsers(this.chosen)
        const allowed = new Set(this.users.map(u => u.user))
        for (const user of this.sharedUsers) if (!allowed.has(user)) this.sharedUsers.delete(user)
    }
    toggleUser (user: string, checked: boolean): void {
        if (checked) this.sharedUsers.add(user)
        else this.sharedUsers.delete(user)
    }
    selectAll (enabled: boolean): void {
        this.selectedIds = new Set(enabled ? this.profiles.map(p => p.id!) : [])
        this.refreshTree()
    }
    async export (): Promise<void> {
        this.error = ''; this.info = ''
        try {
            const pkg = core.createPackage(this.profiles, this.groups, this.selectedIds, this.sharedUsers)
            const json = JSON.stringify(pkg, null, 2)
            // Browser-generated local download: no network upload and no secret store access.
            const blob = new Blob([json], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const anchor = document.createElement('a')
            anchor.href = url
            anchor.download = 'tabby-profiles.tabby-profiles.json'
            document.body.appendChild(anchor)
            anchor.click()
            anchor.remove()
            setTimeout(() => URL.revokeObjectURL(url), 1000)
            this.info = 'Export prepared: ' + pkg.profiles.length + ' SSH profiles, ' + pkg.groups.length + ' folders.'
        } catch (e) { this.error = String(e.message || e) }
    }
    async onFile (event: Event): Promise<void> {
        this.error = ''; this.info = ''; this.imported = null
        const input = event.target as HTMLInputElement
        const file = input.files?.[0]
        if (!file) return
        try {
            if (file.size > core.MAX_BYTES) throw new Error('File exceeds 5 MB')
            const data = core.parsePackage(await file.text())
            this.imported = data
            this.importFileName = file.name
            const missing = data.profiles.filter(p => !p.options.user)
            this.importSummary = data.groups.length + ' new folders, ' + data.profiles.length + ' new profiles. ' + missing.length + ' need SSH username.'
        } catch (e) { this.error = String(e.message || e) }
        input.value = ''
    }
    async import (): Promise<void> {
        if (!this.imported || this.busy) return
        this.busy = true; this.error = ''; this.info = ''
        try {
            const missing = this.imported.profiles.filter(p => !p.options.user)
            let username = ''
            if (missing.length) {
                const examples = missing.slice(0, 4).map(p => p.name + ' (' + p.options.host + ')').join(', ')
                const rest = missing.length > 4 ? ', and ' + (missing.length - 4) + ' more' : ''
                const modal = this.modal.open(PromptModalComponent)
                modal.componentInstance.password = false
                modal.componentInstance.prompt = 'SSH username for ' + missing.length + ' devices: ' + examples + rest + '. Leave blank to keep empty.'
                const answer = await modal.result.catch(() => null)
                if (!answer) { this.info = 'Import cancelled.'; return }
                username = typeof answer.value === 'string' ? answer.value.trim() : ''
                if (username.length > 255) throw new Error('SSH username too long')
            }
            // Validate again before any mutation. Nothing in the destination is updated/deleted.
            const data = core.parsePackage(JSON.stringify(this.imported))
            const uid = () => 'share-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2) + '-' + Math.random().toString(36).slice(2)
            const plan = core.buildImportPlan(data, username, uid)
            const previousGroups = [...this.config.store.groups]
            const previousProfiles = [...this.config.store.profiles]
            try {
                this.config.store.groups.push(...plan.groups)
                this.config.store.profiles.push(...plan.profiles)
                await this.config.save()
            } catch (e) {
                this.config.store.groups = previousGroups
                this.config.store.profiles = previousProfiles
                try { await this.config.save() } catch { /* preserve original exception */ }
                throw e
            }
            this.info = 'Imported ' + plan.profiles.length + ' new profiles and ' + plan.groups.length + ' folders. Existing entries were preserved.'
            this.imported = null
            await this.reload()
        } catch (e) { this.error = String(e.message || e) }
        finally { this.busy = false }
    }
}
