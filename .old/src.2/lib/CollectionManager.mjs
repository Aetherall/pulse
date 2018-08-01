export default class CollectionManager extends Map {
	constructor() {
		super()
	}

	get(typename) {
		if (super.has(typename)) return super.get(typename)
		throw new Error(`[ Pulse - Collection Manager ] Collection ${typename} not found`)
	}
}
