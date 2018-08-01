import express from 'express'

class PulseServer {
	constructor({}) {
		this.app = express()
		this.app.get('/collections/:typename', this.find)
		this.app.get('/collections/:typename/:id', this.get)
		this.app.post('/collections/:typename', this.save)
	}

	find(req, res){
		const typename = req.params.typename
		const user = req.user

		const collection = Pulse.getCollection(typename)
		const result = collection.find(req.query, user)
		return result
	}

	get(req, res){
		const { typename, id } = req.params
		const user = req.user
		const collection = Pulse.getCollection(typename)
		const result = await collection.get(id, user)
		return result
	}

	save(req, res){
		const typename = req.params.typename
		const user = req.user
		const item = Pulse.Object.fromJson(req.body)
		const result = await item.save(user)
		return result
	}

}
