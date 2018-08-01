import { Pulse } from '../lib'

export default class Server {
	constructor({ core, db }) {
		this.db = db
		this.core = core
	}

	async handle(payload) {
		//const user = req.user
		//const payload = req.body
		const session = await this.db.createSession()
		const pulse = new Pulse(this.core).proxy
		const stepper = new pulse.Stepper(payload, session)
		stepper.executeStep(stepper.steps[0], session)
	}
}


class Save {

	execute(item){
		const Collection = CM.get(item.className)

		for(const key in toSave){
			if(Collecton[key].isRelation) actions.push(new Act(Collecton[key], toSave[key]))
		}
	}

}

class Act {

	constructor(field, op){

	}

	execute(){
		if(this.op.many)
	}


	executeMany(){

	}
}