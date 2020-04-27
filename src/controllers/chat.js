var Chat 	= require('../services/chat.js');

var service = new Chat();

var chat 	= {
	start: 	 (req,res,next) => {
		return res.render('chat');
	},
	handle: 	{
		message: 	async (room,message) => {
			var handled = await service.message({room:room,message:message});
			if ( ! handled) return false;
			return handled;
		}
	}
};

module.exports 	= chat;
