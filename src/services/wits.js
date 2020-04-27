var { Wit } = require('node-wit');
var config 	= require('../config');

class Wits {
	constructor() {
		var accessToken = config.wit.token;
		this.client 	= new Wit({accessToken});
	}

	async query(text) {
		const queryResult = await this.client.message(text);

		const { entities } = queryResult;
		const extractedEntities = {};

		Object.keys(entities).forEach((key) => {
			if (entities[key][0].confidence > 0.8){ // make sure confidence value is high
				extractedEntities[key] = entities[key][0].value;
			}
		});

		return extractedEntities;
	}
}
module.exports 	= Wits;
