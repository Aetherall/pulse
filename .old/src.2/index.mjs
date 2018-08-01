import express from 'express'

import api from './pulse'

import './collections'

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

console.log(api)

api.handle(payload)
