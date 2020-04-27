var mongoose = require('mongoose')

const LeadSchema  = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    datetime: Date
});

const Lead = mongoose.model('Lead', LeadSchema);

module.exports = Lead;
