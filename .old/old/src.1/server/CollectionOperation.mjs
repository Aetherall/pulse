// import mongo from 'mongodb'
// import { cpus } from 'os';

// class Mongo {
// 	constructor({ url, db, rs = 'rs' }) {
// 		this.client = new mongo.MongoClient(url, { useNewUrlParser: true, replicaSet: rs })
// 		this.connection = this.connect()
// 	}

// 	async connect() {
// 		try {
// 			await this.client.connect()
// 		} catch (e) {
// 			console.error('[ DB - Mongo ] Error connecting to server, retrying in 5s .......', e)
// 			setTimeout(this.connect, 5000)
// 		}
// 		return this.client
// 	}

// 	get db() {
// 		return this.connection
// 	}
// }

// class CollectionOperation {
// 	constructor(mongo) {
// 		this.mongo = mongo
// 		return this.init()
// 	}

// 	async init() {
// 		this.db = await this.mongo.db
// 		this.session = this.db.startSession()
// 		return this
// 	}

// 	begin() {
// 		this.session = this.db.startSession()
// 	}

// 	execute(action) {
// 		const a = action.action
// 	}

// 	update(id, data) {
// 		this.db.update()
// 	}
// }

// ;(async () => {
// 	const mongo = new Mongo({
// 		url: 'mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=rs'
// 	})

// 	const operation = await new CollectionOperation(mongo)

// 	operation.execute(action)

// 	operation.begin()

// 	console.log(operation)
// })()

// function execute(actions){
// 	const orderActions = orderActions(actions)
// }

const actiokns = [
	{ id: 1, kind: 'create', data: { title: { op: 'set', value: 'tite' } } },
	{ id: 2, kind: 'update', data: { title: { op: 'set', value: 'titdle' }, comments: { op: 'add', value: [{ type: 'pointer', typename: 'Comment', id: '262121' }] } } },
	{ id: 3, kind: 'create', data: { title: { op: 'set', value: 'titlqe' }, comments: { op: 'add', value: [{ type: 'pointer', typename: 'Comment', localId: 1 }] } } }
]

// class DependencyGraph{

// 	constructor(actions){
// 		this.actions = actions
// 		this.deps = {}
// 	}

// 	add(action, id){
// 		if(!this.deps[action.id]) this.deps[action.id] = [id]
// 		else this.deps[action.id].push(id)
// 	}

// }

// function orderActions(actions){
// 	const deps = {}
// 	for(action of actions){
// 		const actionDeps = []
// 		const typename = action.typename
// 		const relationFields = Pulse.SchemaManager.getRelationFields(typename)
// 		for(fieldname of relationFields){
// 			const fieldValue = action.data[fieldname] && action.data[fieldname].value
// 			if(!fieldValue) continue
// 			if(Array.isArray(fieldValue)){
// 				for(const pointer of fieldValue){
// 					if(pointer.localId) actionDeps.push(pointer.localId)
// 				}
// 			}else{
// 				if(fieldValue.localId) actionDeps.push(pointer.localId)
// 			}
// 		}
// 		deps[action.id] = actionDeps
// 	}

// 	const order = []
// 	for(const id in deps){
// 		if(deps[id].length === 0) {
// 			order.push(id)
// 		}
// 	}
// }

function dependsOnOther(id, selfdeps, others) {
	const doDependOnOthers = selfdeps.some(dep => others.includes(dep))
	if (doDependOnOthers) return true
	return false
}

function othersDependsOnHim(id, others) {
	return others.some(other => other.includes(id))
}

const actions = {
	a: ['b', 'c', 'd'],
	b: ['c'],
	c: [],
	d: ['b', 'c', 'a'],
	e: [],
	f: [],
	g: []
}
// c b d a

function getToSave(actions) {
	for (const id in actions) {
		const { [id]: self, ...others } = actions
		const d = dependsOnOther(id, self, Object.keys(others))
		if (!d) return id
	}
	throw new Error('Cyclic dependencies !')
}

function sort(actions) {
	let s = []
	let pending = Object.keys(actions).length
	while (Object.keys(actions).length) {
		const toSave = getToSave(actions)
		s.push(toSave)
		delete actions[toSave]
	}
	return s
	console.log(s)
	console.log(actions)
	// for (const id in actions) {
	// 	const { [id]: self, ...others } = actions
	// 	console.log(id)
	// 	console.log(self)
	// 	console.log(Object.keys(others))
	// 	const keys = Object.keys(others).map(i => Number(i))
	// 	if (dependsOnOther(id, self, keys)) {
	// 		return true
	// 	}
	//}
}

function nodeps(graph, prev) {
	const l = Object.keys(graph).length
	console.log(Object.keys(graph).length)
	if (!Object.keys(graph).length) return []
	let no = []
	let ids = []
	let next = {}
	for (const id in graph) {
		console.log(id)
		if (!graph[id].length) {
			no.push(id)
			delete graph[id]
		}
	}
	for (const id in graph) {
		graph[id] = graph[id].filter(i => !no.includes(i))
	}

	if (Object.keys(graph).length === l) throw new Error('Cyclic dependencies')
	return [no].concat(nodeps(graph))
}

function sooo(graph) {
	const noDeps = nodeps(graph)
	noDeps[1] //?
	// while (Object.keys(actions).length) {

	// 	const toSave = getToSave(actions)
	// 	s.push(toSave)
	// 	delete actions[toSave]
	// }
	return noDeps
}

sooo(actions) //?.
