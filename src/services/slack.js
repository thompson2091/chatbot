var Conversation 	= require('./conversation.js');
var Session 		= require('./session.js');
var Lead 			= require('./lead.js');

class Slack {
	constructor() {
		this.session 		= new Session();
		this.conversation 	= new Conversation();
		this.lead 			= new Lead();
	}
	now() {
		return Math.floor(new Date() / 1000);
	}
	sessionId(channel,user,ts){
		return `${channel}-${user}-${ts}`;
	}
	async process(session, event){
		var message 			= event.text.replace(/<@[A-Z0-9]+>/,'').trim();	// clean message
		var context 			= await this.conversation.run(message, session.context);
		var { conversation }	= context;
		var { entities }		= conversation;
		var text 				= '';

		if ( ! conversation.complete) {
			text 	= conversation.followUp;
		} else {

			// process differently based on intent (i.e. reservation different than lead)
			if (entities.intent == 'reservation'){
				var { intent, customerName, reservationDateTime, numberOfGuests } = entities;
				// attempt to insert reservation
				text 	= 'Successfully reserved your table!';
			} else {

				// else this is the add lead intent
				var { intent, contact, email, phone_number } = entities;
				var user 	= {
					name: 		contact,
					email: 		email,
					phone: 		phone_number,
					datetime: 	this.now()
				};

				console.log(user);


				// attempt to insert lead
				var insert 	= await this.lead.create(user);

				// set response text
				text 	= (insert.success)? insert.success: insert.error;
			}

		}

		// return next text and session var
		return {
			text: 		text,
			session: 	session
		};

	}
	async mention(event){
		var sessionId 	= this.sessionId(event.channel,event.user,event.thread_ts || event.ts);
		var session 	= this.session.get(sessionId);
		if ( ! session) {
			session 			= this.session.create(sessionId);
			session.context 	= {
				slack: 	{
					channel: 	event.channel,
					user: 		event.user,
					thread_ts: 	event.thread_ts || event.ts
				}
			};
		}
		return this.process(session, event);
	}
	async message(event){
		var sessionId 	= this.sessionId(event.channel,event.user,event.thread_ts || event.ts);
		var session 	= this.session.get(sessionId);
		if ( ! session) return false;
		return this.process(session, event);
	}
}
module.exports 	= Slack;
