import PulseServer from './server/Server'
import Mongo from './server/Mongo'
import Core from './lib/Core'

const core = new Core()

global.CM = core.CollectionManager

const db = new Mongo({
	url: 'mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=rs'
})

const server = new PulseServer({
	db,
	core
})

export default server
