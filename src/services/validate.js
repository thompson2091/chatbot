/*
*	Class to validate form data
*/ 
class Validate {
	constructor(){

	}
	email(email){
		return true;
	}
	phone(phone){
		return true;
	}
	name(name){
		return true;
	}
	required(data){
		// make sure we have all required fields
		var required 	= [
			"name",
			"email",
			"phone",
			"datetime",
			"noexist",
			"stillnoexist"
		];
		
		// DEBUG: This isn't working!
		required.forEach(field => {
			if (!data[field]) {
				return false;
			}
		});
		return true;
	}
	all(data){
		
		// custom logic for our form validation
		if ( ! this.required(data)) {
			return "Required fields are missing.";
		}

		if ( ! this.email(data['email'])){
			return "Please enter a valid email address."
		}

		if ( ! this.phone(data['phone'])){
			return "Please enter a valid phone number.";
		}

		if ( ! this.name(data['name'])){
			return "Please enter your name.";
		}

		// if we made it here, then all was successful
		return true;
	}
}
module.exports 	= Validate;
