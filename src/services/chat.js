var Conversation 	= require('./conversation.js');
var Session 		= require('./session.js');
var Lead 			= require('./lead.js');

class Chat {
	constructor() {
		this.session 		= new Session();
		this.conversation 	= new Conversation();
		this.lead 			= new Lead();
	}
	
	now() {
		return Math.floor(new Date() / 1000);
	}

	sessionId(room){
		return `${room}`;
	}

	async process(session, event){
		var message 			= event.message.replace(/<@[A-Z0-9]+>/,'').trim();	// clean message
		var context 			= await this.conversation.run(message, session.context);
		var { conversation }	= context;
		var { entities }		= conversation;
		var text 				= '';

		if ( ! conversation.complete) {
			text 	= conversation.followUp;
		} else {

			// setup lead vars
			var { intent, contact, email, phone_number } = entities;
			var user 	= {
				name: 		contact,
				email: 		email,
				phone: 		phone_number,
				datetime: 	this.now()
			};

			// attempt to insert lead
			var insert 	= await this.lead.create(user);

			// set response text
			text 	= (insert.success)? insert.success: insert.error;

		}

		// return next text and session var
		return {
			text: 		text,
			session: 	session
		};

	}

	async mention(event){
		var sessionId 	= this.sessionId(event.room);
		var session 	= this.session.get(sessionId);
		if ( ! session) {
			session 			= this.session.create(sessionId);
			session.context 	= {
				chat: 	{
					room: 		event.room,
					message: 	event.message,
				}
			};
		}
		return this.process(session, event);
	}

	async message(event){
		var sessionId 	= this.sessionId(event.room);
		var session 	= this.session.get(sessionId);
		if ( ! session) {
			session 			= this.session.create(sessionId);
			session.context 	= {
				chat: 	{
					room: 		event.room,
					message: 	event.message,
				}
			};
		}
		return this.process(session, event);
	}
}

module.exports 	= Chat;
