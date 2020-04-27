/* 
*	Class to help manage our conversation (in Slack)
*/ 
var Wits  	= require('./wits.js');

class Conversation {
	constructor(){
		this.wit 	= new Wits();
	}
	async run(text,context){
		// if no context, let's provide some
		if ( ! context.conversation){
			context.conversation 	= {
				entities: 	{},		// entities we were able to determine
				followUp: 	'',		// follow up message
				complete: 	false, 	// conversation complete boolean
				exit: 		false	// exit conversation boolean
			};
		}

		// if no text, lets start the conversation
		if ( ! text) {
			context.conversation.followUp 	= 'Hello!  Please tell me your name.';
			return context;
		}

		// grab entities discovered using Wit
		var entities 	= await this.wit.query(text);
		// merge known entities with newly discovered ones
		context.conversation.entities 	= { ...context.conversation.entities, ...entities };

		// handle bye
		if (context.conversation.entities.bye){
			context.conversation.followUp 	= 'Goodbye!  This session is now closed.';
			context.conversation.complete 	= true;
			context.conversation.exit 		= true;
			return context;
		}

		// handle greetings
		if (context.conversation.entities.greetings && ! context.conversation.entities.intent){
			context.conversation.followUp 	= 'Hello!  Please tell me your name.';
			return context;
		}

		// if we were able to determine their intent, let's attempt to grab entities for this intent
		if (context.conversation.entities.intent){
			return this.intent(context);
		} else {
			// else, let's assume they are attempting to insert a lead
			return this.lead(context);
		}

		// if we don't know their intent, let's ask
		context.conversation.followUp 	= 'Please describe your intent.';
		return context;
	}
	intent(context){
		// see if intent method exists
		var method 	= context.conversation.entities.intent;
		if (typeof this[method] == 'function'){
			return this[method](context);
		}
		context.conversation.followUp 	= 'We were unable to determine your intent.';
		return context;
	}
	lead(context){
		const { conversation } 	= context;
		const { entities }		= conversation;

		// see if we are missing any entity information
		if ( ! entities.contact){
			conversation.followUp 	= 'What is your name?'
			return context;
		}

		if ( ! entities.email){
			conversation.followUp 	= 'Please enter your email address.';
			return context;
		}

		if ( ! entities.phone_number){
			conversation.followUp 	= 'Please enter your phone number.';
			return context;
		}

		// if we made it here, we have what we need
		conversation.complete 	= true;
		return context;
	}
	reservation(context){
		const { conversation } 	= context;
		const { entities }		= conversation;

		// see if we are missing any entity information
		if ( ! entities.customerName){
			conversation.followUp 	= 'Please give me a name for your reservation.';
			return context;
		}
		
		if ( ! entities.numberOfGuests){
			conversation.followUp 	= 'How many people are included in your reservation?'
			return context;
		}

		if ( ! entities.reservationDateTime){
			conversation.followUp 	= 'What day and time would you like to reserve a table?'
			return context;
		}

		// if we made it here, we have what we need
		conversation.complete 	= true;
		return context;
	}
}
module.exports 	= Conversation;
