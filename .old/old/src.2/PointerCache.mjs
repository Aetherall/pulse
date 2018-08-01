class PointerCache extends Map {
	constructor() {
		super()
		this.counter = 0
	}

	newLocalId() {
		return this.counter++
	}

	get(config) {
		const { typename, id, localId } = config
		if (!typename || (!id && !localId)) throw new Error('A pointer should have a typename and an id or  localId')
		if (id && super.has(typename + id)) return super.get(typename + id)
		if (localId && super.has(typename + localId)) return super.get(typename + localId)
		const pointer = new Pointer(config, true)
		if (id) {
			super.set(typename + id, pointer)
			return pointer
		}
		if (localId) {
			super.set(typename + localId, pointer)
			return pointer
		}
	}

	set(typename, id, localId, pointer) {
		if (id) return super.set(typename + id, pointer)
		if (localId) return super.set(typename + localId, pointer)
		throw new Error('A pointer should have an id or a localId')
	}
}
