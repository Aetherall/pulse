import Collection from './Collection.mjs'
import Field from './Field.mjs'
import FieldMany from './FieldMany.mjs'
import FieldOne from './FieldOne.mjs'

class Post extends Collection {}
//class Comment extends Collection {}

Post.title = new Field({
	name: 'title',
	type: String,
	perm: {
		get: (user, value, post) => {
			console.log(`Post [${post.id}] get title => ${value}`)
		},
		set: (user, value, post) => {
			console.log(`Post [${post.id}] set title => ${value}`)
		}
	}
})

// Post.comments = new FieldMany({
// 	name: 'comments',
// 	type: 'Comment',
// 	perm: {
// 		connect: (user, post, comment) => {
// 			console.log(`Post [${post.id}] ==> connect <== comments [${comment.id}]`)
// 		},
// 		disconnect: (user, post, comment) => {
// 			console.log(`Post [${post.id}] ==> disconnect <== comments [${comment.id}]`)
// 		}
// 	}
// })

// Comment.title = new Field({
// 	name: 'title',
// 	type: String,
// 	perm: {
// 		get: (user, value, comment) => {
// 			console.log(`Comment [${comment.id}] get title => ${value}`)
// 		},
// 		set: (user, value, comment) => {
// 			console.log(`Comment [${comment.id}] set title => ${value}`)
// 		}
// 	}
// })

// Comment.post = new FieldOne({
// 	name: 'comments',
// 	type: 'Post',
// 	perm: {
// 		connect: (user, comment, post) => {
// 			console.log(`Comment [${comment.id}] ==> connect <== post [${post.id}]`)
// 		},
// 		disconnect: (user, comment, post) => {
// 			console.log(`Comment [${comment.id}] ==> disconnect <== post [${post.id}]`)
// 		}
// 	}
// })

// Comment.post.setTarget(Post.comments)
// Post.comments.setTarget(Comment.post)
