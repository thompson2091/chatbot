var express 	= require('express');
var config 		= require('../config');
var router 		= express.Router();

/*
// setup slack events api
var { createEventAdapter } 	= require('@slack/events-api');
var slackEvents 			= createEventAdapter(config.slack.signingSecret);
*/

// setup controllers
var admin 	= require('../controllers/admin.js');
var index 	= require('../controllers/index.js');
var chat 	= require('../controllers/chat.js');
//var slack 	= require('../controllers/slack.js');


module.exports 	= function(io){

	// setup routes
	router.get('/', 					index.get);
	router.post('/', 					index.post);
	router.get('/admin', 				admin.get);
	router.get('/chat', 				chat.start);

	/*
	// setup slack event listener
	router.use('/bots/slack/events', 	slackEvents.expressMiddleware());

	// add slack event handlers
	slackEvents.on('app_mention',		slack.handle.mention);
	slackEvents.on('message',			slack.handle.message);
	*/

	// setup chatroom socket.io chatroom namespace
	const rooms = io.of('/chatroom');
	rooms.on('connection', async (socket) => {
		socket.on('join', (data) => {
			console.log('joined room', data);
			socket.join(data.room);
			rooms.in(data.room).emit('message', `Hello and welcome to my chat bot!  Please tell me your name.`);
		});
		socket.on('message',async (data) => {
			rooms.in(data.room).emit('message', data.message);
			var response = await chat.handle.message(data.room,data.message);
			if (response.session.context.conversation.complete){
				rooms.in(data.room).emit('message', `Thank you ${response.session.context.conversation.entities.contact}, we have successfully saved your information and will call you at ${response.session.context.conversation.entities.phone_number}.  Goodbye!`);
				socket.disconnect();
			} else {
				rooms.in(data.room).emit('message', response.text);
			}
		});
		socket.on('disconnect',() => {
			console.log('user disconnected');
			//rooms.emit('message', "Goodbye!  This session has ended.");
		});
	});

	return router;
}

