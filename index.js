class Pointer {
	constructor(core, ...args) {
		this.core = core
		this.args = args
	}

	static from(...args) {
		console.log(this, args)
	}
}

class A {
	constructor(core, ...args) {
		this.core = core
		this.args = args
	}

	static from(...args) {
		console.log(this, args)
	}
}

class Core {
	constructor() {
		this.Pointer = Pointer
		this.cache = new Cache()
	}
}

class PulseG {
	constructor() {
		this.Pointer = Pointer
		this.A = A
		this.proxy = new Proxy(function() {}, {
			get: (_, prop) => {
				if (_[prop]) return _[prop]
				_[prop] = new Proxy(function() {}, {
					construct: (_, args) => new this[prop](this.proxy, ...args),
					get: (_, method) => {
						if (method === Symbol.hasInstance) return instance => instance instanceof this[prop]
						if (_[method]) return _[method]
						_[method] = new Proxy(function() {}, {
							apply: (_, __, args) => this[prop][method](this.proxy, ...args),
							construct: (_, args) => this[prop][method](this.proxy, ...args)
						})
						return _[method]
					}
				})
				return _[prop]
			}
		})
	}
}

function PulseF(core) {
	return new Proxy(this, {
		get(_, prop) {}
	})
}

const G = new PulseG()
const Pulse = G.proxy

console.log(Pulse)

const pointer = new Pulse.Pointer(1, 2, 3) //?
const o = Pulse.Pointer.from(1, 2, 3) //?
const poingter = new Pulse.Pointer(1, 52, 3) //?
const a = new Pulse.A(1, 52, 3) //?

poingter instanceof Pulse.Pointer //?
