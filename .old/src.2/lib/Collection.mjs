class State {
	constructor(core) {
		this.core = core
		this.state = new Map()
	}

	set(attr, value) {
		this.startUnsafeState()
		if (this.state.has(attr) && value instanceof this.core.Op) this.state.set(attr, value.mergeWith(this.state.get(attr)))
		else this.state.set(attr, value)
		return this
	}

	setSafe(attr, value) {
		this.state.set(attr, value)
		return this
	}

	get(attr) {
		return this.state.get(attr)
	}

	startUnsafeState() {
		this.unsafe = true
		this.safe = new Map(this.state)
	}

	commitUnsafeState() {
		this.unsafe = false
		this.safe = new Map(this.state)
	}

	abortUnsafeState() {
		this.unsafe = false
		this.state = new Map(this.safe)
	}
}

export default class Collection {
	constructor(core, pointer) {
		if (pointer && core.cache.object.has(pointer)) return core.cache.object.get(pointer)
		this.core = core
		this.typename = this.constructor.name
		this.pointer = core.cache.object.create(this)
		this.state = new State(core)
	}

	getConfig(attr) {
		const config = this.constructor[attr]
		if (!config) throw new Error(`[ Pulse - Collection ] Attribute ${attr} is not defined on type ${this.typename} `)
		return config
	}

	async set(attr, value) {
		await this.permset(attr, user, value)
		if (!value instanceof this.core.Op) this.state.set(attr, new this.core.SetOp(value))
		else this.state.set(attr, value)
		return this
	}

	async get(attr) {
		await this.permget(attr, user)
		return this.state.get(attr)
	}

	unset(attr) {
		return this.set(attr, new this.core.UnsetOp())
	}

	apply(state) {
		for (const attr in state) {
			this.set(attr, state[attr])
		}
	}

	applySafe(state) {
		for (const attr in state) {
			this.state.setSafe(attr, state[attr])
		}
	}

	async permset(attr, user, value) {
		const config = this.getConfig(attr)
		if (!config.perm || !config.perm.set) return true
		const meta = { err: [], warn: [] }
		const res = await config.perm.set(meta, user, value, this)
		if (meta.err.length > 0 || !res) throw new Error(`[ Pulse - ${this.typename} ] Cannot set attribute ${attr}`, meta.err)
		return res
	}
}
