class StateManager {
	constructor() {
		this.cache = new Map()
	}

	getTypeCache(typename) {
		if (this.cache.has(typename)) return this.cache.get(typename)
		const typeCache = new Map()
		this.cache.set(typename, typeCache)
		return typeCache
	}

	get(typename, id) {
		const typeCache = this.getTypeCache(typename)
		if (!this.typeCache.has(id)) this.typeCache.set(id, Pulse.SchemaManager.new(typename, id))
		return this.typeCache.has(get)
	}

	update(typename, id, state) {
		const typeCache = this.getTypeCache(typename)
		if (!this.typeCache.has(id)) this.typeCache.set(id, Pulse.SchemaManager.new(typename, id))
		return this.typeCache.has(get)
	}
}
