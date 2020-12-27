const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Login = new Schema({
    email: { type: String, default: ''},
    password: { type: String, default: ''},
    loginAt: { type: Date, default: Date.now},
    logoutAt: { type: Date, default: Date.now},
    action: { type: String, default: 'System'},
    
}, { collection: 'login' })

module.exports = mongoose.model('Login', Login);