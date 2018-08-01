import { Pulse, Core, Collection } from '../ts'
import jsonToOp from '../ts/Operation/utils/jsonToOp.mjs'

const c = new Core()

global.CM = c.static.CollectionManager

class Post extends Collection {}

class Comment extends Collection {}

Post.title = {
	type: String,
	perm: {
		get: (user, value, object) => {
			//if(!user.isAdmin) throw new Error('')
			console.log(user, value, object)
		}
	}
}

Post.comments = {
	type: ['Comment']
}

Comment.message = {
	type: String
}

Comment.post = {
	type: 'Post'
}

CM.register(Post)
CM.register(Comment)

const payload = [
	{
		pointer: { typename: 'Post', localId: 'a' },
		data: {
			title: { op: 'set', value: 'H' },
			comments: {
				op: 'add',
				value: [{ typename: 'Comment', id: 'z' }, { typename: 'Comment', localId: 'b' }]
			}
		}
	},
	{
		pointer: { typename: 'Comment', localId: 'b' },
		data: {
			message: { op: 'set', value: 'coucou' },
			post: {
				op: 'set',
				value: { typename: 'Post', localId: 'a' }
			}
		}
	},
	{
		pointer: { typename: 'Comment', localId: 'c' },
		data: {
			message: { op: 'set', value: 'coucsou' }
		}
	},
	{
		pointer: { typename: 'Comment', id: 'e' },
		data: {
			message: { op: 'set', value: 'coucssssou' }
		}
	}
]

class Action {
	constructor(core, action) {
		this.core = core
		this.pointer = new core.Pointer(action.pointer)
		this.data = new Map()
	}
}

function createAction(core, action) {
	const pointer = new core.Pointer(action.pointer)
	const data = new Map()
	action.data //?
	for (const attr in action.data) data.set(attr, jsonToOp(core, action.data[attr]))
	return { pointer, data }
}

async function a(payload) {
	const p = new Pulse(c).proxy
	for (const action of payload) {
		const { pointer, data } = createAction(p, action)
		// pointer.toObject ? if local, new object, else, fetch object
		const item = await pointer.toObject()
		if (!item) continue
		item.applyOps(data)
		//item.applyOps(action.data)
		console.log(item)
	}
}

a(payload)
