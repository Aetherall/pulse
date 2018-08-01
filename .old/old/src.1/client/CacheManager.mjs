class FailSafeMap extends Map {
	constructor(getter) {
		super()
		this.getter = getter
	}

	get(key) {
		if (!this.has(key)) return this.set(key, this.getter(key))
		return super.get(key)
	}

	set(key, value) {
		super.set(key, value)
		return value
	}
}

const c = new FailSafeMap(() => new Map())

c.get('test') //?
c.set('test', 12) //?
c.get('test') //?

class Cache {
	constructor() {
		this.cache = new CacheMap()
	}

	get(cache, ...args) {
		if (!this.cache.has(cache)) this.cache.set(cache, new Map())
		return this.cache.get(cache)
	}
}

// class Cache extends Map {

//   constructor(){
//     super()
//     this.types = new Map()
//   }

//   get(typename, id){
//     const
//     return super.get(typename).get(id)
//   }

// }

// class CacheManager {
// 	constructor() {
// 		this.pointers = new Cache()
//   }

//   get(typename, id, localId){

//   }

//   applyIdToLocalId(typename, id, localId){
//     this.get(typename, null, localId)
//   }
// }
