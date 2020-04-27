var Lead 		= require('../services/lead.js');
var Validate 	= require('../services/validate.js');

var index 	= {
	get: 	async (req,res,next) => {
		try {
			return res.render('index',{
				formdata: {
					name: 		"", 
					email: 		"",
					phone: 		"", 
					datetime: 	""
				},
				result: {}
			});
		} catch(err) {
			return next(err);
		}
	},
	post: 	async (req,res,next) => {
		try {
			var { name, email, phone, datetime } = req.body;
			var lead 		= new Lead();
			var validate 	= new Validate();

			// validate form submission
			var error 	= validate.all({
				name: 		name,
				email: 		email,
				phone: 		phone,
				datetime: 	datetime
			});

			// if failed validation, send with error
			if (error !== true) {
				return res.render('index', {
					formdata: {
						name: 		name, 
						email: 		email, 
						phone: 		phone, 
						datetime: 	datetime
					},
					result: {
						error: error
					}
				});
			}

			// insert leads into system
			var result 	= await lead.create({
				name: 		name,
				email: 		email,
				phone: 		phone,
				datetime: 	datetime
			});

			return res.render('index',{
				formdata: {
					name: 		name, 
					email: 		email, 
					phone: 		phone, 
					datetime: 	datetime
				},
				result: result
			});
		} catch(err) {
			return next(err);
		}
	}
};

module.exports 	= index;
