import Pulse from '../lib/Pulse'

// class DbProcess {
// 	execute(core, user, action) {
// 		if (action.mutation === 'create') return this.create(core, user, action)
// 		if (action.mutation === 'update') return this.update(core, user, action)
// 	}

// 	create(core, user, action) {
// 		const pointer = action.pointer
// 		const Collection = core.CollectionManager.get(pointer.typename)
// 		const item = new Collection(core, pointer)
// 	}

// 	update(core, user, action) {
// 		const pointer = action.pointer
// 		const Collection = core.CollectionManager.get(pointer.typename)
// 		const item = new Collection(core, pointer)
//     const itemData = await this.session.findByPointer(pointer)
//     item.setState(itemData)
//     const future = item.clone()
//     future.apply(action.data)

// 	}
// }

export default class Server {
	constructor({ core, db }) {
		this.db = db
		this.core = core
	}

	async handle(payload) {
		//const user = req.user
		//const payload = req.body
		const session = await this.db.createSession()
		const pulse = new Pulse(this.core).proxy
		const stepper = new pulse.Stepper(payload, session)
		stepper.executeStep(stepper.steps[0], session)
	}
}
