/* 
*	Class to handle sessions
*/
class Session {
	
	constructor(){
		this.sessions 	= {};
		this.timeout 	= 60 * 5;	// 5 minute timeout
	}

	now() {
		return Math.floor(new Date() / 1000);
	}

	create(sessionId){
		this.cleanup();
		// channel - user - ts
		this.sessions[sessionId] = {
			timestamp: 	this.now(),
			context: 	{},	// used to maintain context information
		};
		return this.sessions[sessionId];
	}

	get(sessionId) {
		this.cleanup();
		if ( ! this.sessions[sessionId]) return false;
		this.update(sessionId);	// update session timestamp while user is still interacting
		return this.sessions[sessionId];
	}

	delete(sessionId){
		if ( ! this.sessions[sessionId]) return false;
		delete this.sessions[sessionId];
	}

	update(sessionId){
		this.cleanup();
		if ( ! this.sessions[sessionId]) return false;
		this.sessions[sessionId].timestamp = this.now();
		return this.sessions[sessionId];
	}

	cleanup(){
		const now = this.now();
		Object.keys(this.sessions).forEach((key) => {
			const session = this.sessions[key];
			if (session.timestamp + this.timeout < now){
				this.delete(key);
			}
		});
		return true;
	}
}

module.exports = Session;
