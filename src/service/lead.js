/*
*	Class to handle leads
*/ 
//const Model 	= require('../models/lead.js');
const path 		= require('path');
const fs 		= require('fs');
const util 		= require('util');


var readFile 	= util.promisify(fs.readFile);
var writeFile 	= util.promisify(fs.writeFile);

class Lead {
	constructor(filename) {
		this.filename 	= path.join(__dirname, '../data/leads.json');
	}
	static now() {
		return Math.floor(new Date() / 1000);
	}
	async create(lead) {

		// will insert into mongoose later
		// but for now will be inserting into local file
		var all = await this.all();
		all.unshift(lead);	// add to front of array
		await writeFile(this.filename, JSON.stringify(all.sort((a,b) => b.datetime - a.datetime)));
		return {success: "Lead has been successfully inserted!"};
		/*
		var user 		= new Model();
		user.name 		= lead.name;
		user.email 		= lead.email;
		user.phone 		= lead.phone;
		user.datetime 	= lead.datetime;
		return await user.save();
		*/
	}
	async all() {
		// will grab from mongoose later
		// for now, read from file
		var data 	= await readFile(this.filename, 'utf8');
		if ( ! data) return [];
		return JSON.parse(data);
	}
	async read(id) {
		// will grab from mongoose later
		// for now, read from file
		var all = this.all();
		Object.keys(all).forEach((key) => {
			if (all[key].id === id){
				return all[key];
			}
		});
		return [];	// unable to find
	}
	update(id,data) {

	}
	delete(id) {

	}
}
module.exports = Lead;
