var Lead = require('../services/lead.js');

var admin 	= {
	get: 	async (req,res,next) => {
		try {
			var lead 	= new Lead();
			var all 	= await lead.all();
			return res.render('admin/index',{leads:all,result:{}});
		} catch(err) {
			return next(err);
		}
	}
};

module.exports 	= admin;
