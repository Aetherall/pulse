class Pointer {
	constructor(config, force) {
		if (config instanceof Pointer) return config
		if (!force) return cache.get(config)
		if (config.typename) this.typename = config.typename
		if (config.id) this.id = config.id
		if (config.localId) this.localId = config.localId
	}

	static fromJson(config) {
		return cache.get(config)
	}

	get exists() {
		return !!this.id
	}
}
