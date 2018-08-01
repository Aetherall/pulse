export default class PulseSet extends Set {
	map(f) {
		const r = new Set()
		for (const x of this) r.add(f(x))
		return r
	}

	exclude(b) {
		const r = new Set()
		for (const x in this) if (!b.has(x)) r.add(x)
		return r
	}

	hasExclusive(b) {
		for (const x of this) if (!b.has(x)) return true
		return false
	}

	some(f) {
		for (const x of this) if (f(x)) return true
	}

	log() {
		this.forEach(i => console.log(i))
	}
}
