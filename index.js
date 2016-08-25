const PingPongBotAPI = require('./PingPongBotAPI/pingpongbotapi');
const SlackListener = require('./slacklistener');

const pingPongBotAPI = new PingPongBotAPI();
const slackListener = new SlackListener();

slackListener.init();