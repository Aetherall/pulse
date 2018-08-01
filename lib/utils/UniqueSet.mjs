function getInitial(value) {
	if (!value) return
	if (value instanceof UniqueSet) return value
	if (value instanceof Array) return value
	return [value]
}

export default class UniqueSet extends Set {
	constructor(value) {
		super(getInitial(value))
	}

	// return all items in t and in this
	common(t) {
		const r = new UniqueSet()
		for (const item of this) if (t.has(item)) r.add(item)
		return r
	}

	// return all items not in t
	minus(t) {
		const r = new UniqueSet()
		for (const item of this) if (!t.has(item)) r.add(item)
		return r
	}

	addAll(toAdd) {
		for (const item of toAdd) super.add(item)
		return this
	}

	deleteAll(toDelete) {
		for (const item of toDelete) super.delete(item)
		return this
	}

	toJSON() {
		const r = []
		for (const item of this) r.push(item.toJSON())
		return r
	}
}

new UniqueSet() //?
