export default class Pulse {
	constructor() {
		this.proxy = new Proxy(function() {}, {
			get: (_, prop) => {
				console.log(prop)
				if (_[prop]) return _[prop]
				if (prop === 'cache') return this.cache
				_[prop] = new Proxy(function() {}, {
					construct: (_, args) => new this[prop](this, ...args),
					get: (_, method) => {
						if (method === Symbol.hasInstance) return instance => instance instanceof this[prop]
						if (_[method]) return _[method]
						_[method] = new Proxy(function() {}, {
							apply: (_, __, args) => this[prop][method](this, ...args),
							construct: (_, args) => this[prop][method](this, ...args)
						})
						return _[method]
					}
				})
				return _[prop]
			}
		})
	}

	setCore(core) {
		for (const e in core) this[e] = core[e]
		core.cache(this)
		return this
	}
}
