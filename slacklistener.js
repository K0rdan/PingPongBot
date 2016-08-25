const Botkit = require('botkit');
const PingPongBotAPI = require('./PingPongBotAPI/pingpongbotapi');
const CONFIG = require('./config');

module.exports = class SlackListener {
	constructor() {
		this.token = CONFIG.TOKEN;
	}

	init() {
		console.log(this.token);
	}

};