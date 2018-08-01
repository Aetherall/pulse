export default class Pulse {
	constructor(core) {
		this.proxified = {}
		this.static = {}
		this.proxy = new Proxy(function() {}, {
			get: (_, prop) => {
				if (_[prop]) return _[prop]
				if (prop === 'cache') return this.static.cache
				if (!(prop in this.proxified)) return this.static[prop]
				_[prop] = new Proxy(function() {}, {
					construct: (_, args) => new this.proxified[prop](this.proxy, ...args),
					apply: (_, __, args) => this.proxified[prop](this.proxy, ...args),
					get: (_, method) => {
						if (method === Symbol.hasInstance) return instance => instance instanceof this.proxified[prop]
						if (method.constructor.name === 'Symbol' && String(method) === 'Symbol(util.inspect.custom)') return null
						if (method === 'inspect' || method === 'name') return null
						if (_[method]) return _[method]
						_[method] = new Proxy(function() {}, {
							apply: (_, __, args) => this.proxified[prop][method](this.proxy, ...args),
							construct: (_, args) => this.proxified[prop][method](this.proxy, ...args)
						})
						return _[method]
					}
				})
				return _[prop]
			}
		})
		if (core) this.setCore(core)
	}

	setCore(core) {
		for (const e in core.proxified) this.proxified[e] = core.proxified[e]
		for (const e in core.static) this.static[e] = core.static[e]
		core.cache(this)
		return this
	}
}
