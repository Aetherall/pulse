import O from '../lib/O.mjs'
import Collection from '../lib/Collection.mjs'

class Post extends Collection {}

Post.title = {
	type: String,
	perm: {
		get: (meta, user, value, doc) => {
			console.log(user, value, doc)
			return true
		},
		set: (meta, user, value, doc) => {
			console.log(user, value, doc)
			return true
		}
	},
	getter: () => {
		return this.get('title')
	},
	setter: value => {
		return
	},
	component: 'input'
}

Post.comments = {
	type: ['Comment'],
	perm: {
		get: (meta, user, value, doc) => {
			console.log(user, value, doc)
		},
		connect: (meta, user, comment, post) => {
			console.log(user, comment, post)
		},
		disconnect: (meta, user, comment, post) => {
			console.log(user, comment, post)
		}
	}
}

CM.set('Post', Post)
