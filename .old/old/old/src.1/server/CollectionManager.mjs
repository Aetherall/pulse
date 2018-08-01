const collections = {}

export function get(typename) {
	return collections[typename]
}

export function set(typename, collection) {
	collections[typename] = collection
}
