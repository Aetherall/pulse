import Pulse from './Pulse'
import Core from './Core'

class Server {
	constructor(db) {
		this.db = db
	}

	async middleware(req, res) {
		const user = req.user
		const payload = req.body
		const response = await this.handle(user, payload)
	}

	handle(user, payload) {
		const instance = new Pulse().setCore(new Core()).proxy
		const stepper = new instance.Stepper(payload)
		stepper.executeStep(stepper.steps[0])
	}
}

const payload = [
	{
		pointer: { typename: 'Post', localId: 'a' },
		mutation: 'create',
		data: {
			title: { op: 'set', value: 'H' },
			comments: {
				op: 'many',
				add: [{ typename: 'Comment', id: 'z' }, { typename: 'Comment', localId: 'b' }]
			}
		}
	},
	{
		pointer: { typename: 'Comment', localId: 'b' },
		mutation: 'create',
		data: {
			message: { op: 'set', value: 'coucou' },
			post: {
				op: 'one',
				connect: { typename: 'Post', localId: 'a' }
			}
		}
	},
	{
		pointer: { typename: 'Comment', localId: 'c' },
		mutation: 'create',
		data: {
			message: { op: 'set', value: 'coucsou' }
		}
	},
	{
		pointer: { typename: 'Comment', id: 'e' },
		mutation: 'update',
		data: {
			message: { op: 'set', value: 'coucssssou' }
		}
	}
]

const s = new Server()
s.handle({}, payload)
