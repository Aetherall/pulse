import { Core, Pulse, Collection } from './src'

const core = new Core()

const parse = new Pulse(core)

const P = parse.proxy

class Post extends Collection {}
class Comment extends Collection {}

Post.title = {
	type: String
}

Post.comments = {
	type: ['Comment'],
	perm: {
		connect: (_, post, comment) => console.log(`[POST.comments] => connect    <= P:${post.pointer.localId} - C:${comment.pointer.localId}`),
		disconnect: (_, post, comment) => console.log(`[POST.comments] => disconnect <= P:${post.pointer.localId} - C:${comment.pointer.localId}`)
	}
}

Comment.post = {
	type: 'Post',
	perm: {
		connect: () => console.log(`[COMMENT.post] connect`),
		disconnect: () => console.log(`[COMMENT.post] disconnect`)
	}
}

const CM = core.static.CM

CM.register(Post)
CM.register(Comment)

const p0 = new P.O.Post()
const p1 = new P.O.Post()
const p2 = new P.O.Post()

const c3 = new P.O.Comment()
const c4 = new P.O.Comment()
const c5 = new P.O.Comment()

async function a() {
	await p0.set('title', 'hello')
	await p0.add('comments', c3)
	await p0.add('comments', c4)
	await c4.set('post', p1)
	await p0.remove('comments', c3)
	console.log(p0.get('comments'))
	console.log(p1.get('comments'))
	console.log(c4.get('post'))
	console.log(c4.get('post'))
}

a()
