// class CacheManager {
// 	constructor() {
// 		this.cache = new Map()
// 	}
// }

// const Cache = new Proxy(new Map(), {
// 	get(_, key) {
// 		if (!_.has(key)) _.set(key, new Map())
// 		return _.get(key)
// 	},
// 	set(_, key, value) {
// 		_.set(key, new value())
// 		return _.get(key)
// 	}
// })

// Cache.pointers.set('User', '5')
// Cache.pointers.get('User')
// class Target {
// 	constructor(...args) {
// 		console.log(...args)
// 	}
// }

// const G = new Proxy(Target, {
// 	construct(Target, b, Class) {
// 		console.log(Target, b, Class)
// 		const name = Class.name
// 		console.log(Target.a)
// 		console.log(Class.a)
// 		return new Class(...b)
// 	}
// })

//new G(1, 2, 3)

// class C extends G {}

// C.a = 1

// new C(1, 2, 3)

// class A {
// 	constructor() {
// 		return new G(this.constructor)
// 	}
// }

class PointerCache extends Map {
	get(typename, id, localId) {
    if(id && super.has(typename + id)) return super.get(typename + id)
    if(localId && super.has(typename + localId)) return super.get(typename + localId)
    throw new Error('A pointer should have an id or a localId')
  }

	set(typename, id, localId, pointer) {
    if(id) return super.set(typename + id, pointer)
    if(localId) return super.set(typename + localId, pointer)
    throw new Error('A pointer should have an id or a localId')
  }
}


class SetOp {

  constructor(value){
    this._value = value
  }

  applyTo(value){
    if(value === this._value) return new NoOp(this._value)
    return 
  }

  mergeWith(previousOp){
    return new SetOp()
  }

}

class State {

  constructor(config){
    this.config = config
    this.attributes = new Map()
  }

  setState(data){
    for(const key in data){
      this.attributes.set(key, new NoOp(data[key]))
    }
  }

  get(attr){
    return this.attributes.get(attr)
  }

}


class PulseObject {
	constructor() {
		this.state = new State(this.constructor)
		this.pointer = new Pointer(this)
	}

	static fromJson(json, override) {
		const pointer = Pointer.getPointer(json)
		const object = PulseObject.getObject(pointer)
		if (override) object.state.setState(json)
	}

	static updateState(pointer, json) {
		Pulse.Cache.State.update(pointer, json)
	}

	static getObject(pointer) {
		return Pulse.Cache.Object.get(pointer)
  }


  getSaveJson(){
    const unsaved = this.getUnsavedChildrens()
    const unsavedJson = unsaved.map(obj => obj.getSaveJson())
    const thisJson = this.state.toJSON()
    return unsavedJson.push(thisJson)
  }
  
  save(){
    const unsaved = this.getUnsavedChildrens
    const unsavedJson = unsaved.map(obj => obj.getSaveJson())
    const saveJson = this.getSaveJson()
    const payload = unsavedJson.push(saveJson)
    const response = await Pulse.Data.request(payload)
    return this
  }

}

class Pointer {
	static getPointer(json) {
		const { typename, id, localId } = json
		const pointer = Pulse.Cache.Pointer.get(typename, id, localId)
		return pointer
	}
}
