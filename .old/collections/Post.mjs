import { Collection } from '../lib'

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

Post.address = {
	type: 'Address',
	perm: {
		get: (meta, user, value, doc) => {},
		set: (meta, user, value, doc) => {}
	}
}

CM.set('Post', Post)

class Field {
	constructor(config) {
		this.type = config.type
		this.perm = config.perm
	}

	canSet(user, value, doc) {
		if (this.perm && this.perm.set) return this.perm.set(user, value, doc)
		return true
	}

	canGet(user, value, doc) {
		if (this.perm && this.perm.get) return this.perm.get(user, value, doc)
		return true
	}
}

/**

class Post extends Collection {

	@perm.get(owner, admin)
	@perm.set(owner, admin)
	static address = "Address"

	static comments = [["Comments"]]

	static author = ["User", "post_user"]

}

class Comment extends Collection {

	static post = ["Post"]

}

class User extends Collection {

	static active = ["Profile", "active"]

	static pending = [["Profile"], "pending"]

}

User.active = {
	field: "active",
	type: "Profile",
	many: false,
	relation: "active"
}

 */
