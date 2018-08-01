export default class Pointer {
	constructor(core, config, force) {
		this.core = core
		if (config instanceof core.Pointer) return config
		if (!force) return core.cache.pointer.get(config)
		if (config.typename) this.typename = config.typename
		if (config.id) this.id = config.id
		if (config.localId) this.localId = config.localId
	}

	static fromJson(core, config) {
		return core.cache.pointers.get(config)
	}

	get exists() {
		return !!this.id
	}
}
