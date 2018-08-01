export default class O {
	constructor(core) {
		return new Proxy(function() {}, {
			get: (_, typename) => {
				if (typename.constructor.name === 'Symbol' && String(typename) === 'Symbol(util.inspect.custom)') return null
				if (typename === 'inspect' || typename === 'name') return null
				const Class = core.CollectionManager.get(typename)
				return new Proxy(function() {}, {
					construct: (_, args) => new Class(core, ...args),
					get: (_, method) =>
						new Proxy(function() {}, {
							construct: (_, args) => Class[method](core, ...args),
							apply: (_, __, args) => Class[method](core, ...args)
						})
				})
			}
		})
	}
}
