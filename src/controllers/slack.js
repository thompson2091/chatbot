var { WebClient }			= require('@slack/web-api'); 
var Slack 					= require('../services/slack.js');
var config 					= require('../config');

var client 	= new WebClient(config.slack.token);
var service = new Slack();

var slack 	= {
	handle: 	{
		mention: 	async (event) => {
			var handled = await service.mention(event);

			return client.chat.postMessage({
				text: handled.text,
				channel: handled.session.context.slack.channel,
				username: 'Matt Thompson\'s Bot',
				thread_ts: 	handled.session.context.slack.thread_ts
			});
		},
		message: 	async (event) => {
			var handled = await service.message(event);
			if ( ! handled) return false;

			return client.chat.postMessage({
				text: handled.text,
				channel: handled.session.context.slack.channel,
				username: 'Matt Thompson\'s Bot',
				thread_ts: 	handled.session.context.slack.thread_ts
			});
		}
	}
};

module.exports 	= slack;
