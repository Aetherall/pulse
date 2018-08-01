import { Pulse, Core, Collection } from '../lib'
import jsonToOp from '../lib/Operation/utils/jsonToOp.mjs'

const c = new Core()

global.CM = c.static.CollectionManager

class Post extends Collection {}
class Comment extends Collection {}

Post.title = {
	type: String,
	perm: {
		set: (user, value, object) => {
			console.log(`[ PERMISSION   SET   ] Post.title ${object.id} => ${value}`)
		},
		get: (user, value, object) => {
			console.log(`[ PERMISSION   GET   ] Post.title ${object.id} => ${value}`)
		}
	}
}

Post.comments = {
	type: ['Comment'],
	perm: {
		connect: (user, post, comment) => {
			console.log(`[ PERMISSION CONNECT ] Post.comments ${post.id} => Comment ${comment.id}`)
		},
		disconnect: (user, post, comment) => {
			console.log(`[ PERMISSION DISCONNECT ] Post.comments ${post.id} =/> Comment ${comment.id}`)
		}
	}
}

Comment.message = {
	type: String,
	perm: {
		set: (user, value, object) => {
			console.log(`[ PERMISSION   SET   ] Comment.message ${object.id} => ${value}`)
		},
		get: (user, value, object) => {
			console.log(`[ PERMISSION   GET   ] Comment.message ${object.id} => ${value}`)
		}
	}
}

Comment.post = {
	type: 'Post'
}

CM.register(Post)
CM.register(Comment)

const payload = [
	{
		pointer: { typename: 'Post', localId: 'a', __type: 'pointer' },
		data: {
			title: { op: 'set', value: 'super title for a' },
			comments: {
				op: 'add',
				value: [{ typename: 'Comment', id: 'z', __type: 'pointer' }, { typename: 'Comment', localId: 'b', __type: 'pointer' }]
			}
		}
	},
	{
		pointer: { typename: 'Comment', localId: 'b', __type: 'pointer' },
		data: {
			message: { op: 'set', value: 'message for b' },
			post: {
				op: 'set',
				value: { typename: 'Post', localId: 'a', __type: 'pointer' }
			}
		}
	},
	{
		pointer: { typename: 'Comment', localId: 'c', __type: 'pointer' },
		data: {
			message: { op: 'set', value: 'message for c' }
		}
	},
	{
		pointer: { typename: 'Comment', id: 'e', __type: 'pointer' },
		data: {
			message: { op: 'set', value: 'message for e' }
		}
	}
]

function createAction(core, action) {
	const pointer = new core.Pointer(action.pointer)
	const data = new Map()
	action.data //?
	for (const attr in action.data) data.set(attr, jsonToOp(core, action.data[attr]))
	return { pointer, data }
}

// problem : some object depends on local objects
// ideal :
// 		make a dependency graph and write an algorithm to minimize the number of db operations
// current :
// 1 - save all objects with no deps, or depending only on saved objects
// 2 - then for cyclic deps, separate the relation fields from the data fields
// 3 - save object with only the data fields
// 4 - update object with relation fields
// ? https://www.electricmonk.nl/docs/dependency_resolving_algorithm/dependency_resolving_algorithm.html

async function a(payload) {
	const p = new Pulse(c).proxy
	for (const action of payload) {
		const { pointer, data } = createAction(p, action)
		// pointer.toObject ? if local, new object, else, fetch object
		const item = await pointer.toObject()
		if (!item) continue
		await item.applyOps(data)
		//item.applyOps(action.data)
	}
	console.log(p.cache.object.values())
}

a(payload)

class Stepper {
	constructor(items) {
		this.items = items
		for (const item of items) {
		}
	}
}
