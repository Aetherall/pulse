import { Collection } from '../lib'

class Comment extends Collection {}

Comment.message = {
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
		return this.get('message')
	},
	setter: value => {
		return
	},
	component: 'input'
}

Comment.post = {
	type: 'Post',
	perm: {
		get: (meta, user, value, doc) => {
			console.log(user, value, doc)
		},
		connect: (meta, user, post, comment) => {
			console.log(user, post, comment)
		},
		disconnect: (meta, user, post, comment) => {
			console.log(user, post, comment)
		}
	}
}

CM.set('Comment', Comment)
