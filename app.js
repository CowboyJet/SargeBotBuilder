var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 443, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: "d8ea3167-7186-468b-b95b-edaf13b7a194",
    appPassword: "xAafrPn7rUmbeeWx0KeaeB8"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================
var intents = new builder.IntentDialog();

bot.dialog('/', intents);

intents.matches(/^.*change.*name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.matches(/((who)|(wie)).*(sergeant)|(sarge)|(seargeant)/i, [
    function (session) {
        request('https://sotdapi.herokuapp.com/sergeant/today', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                session.send(body); // Show the HTML for the Modulus homepage.
            }
        });
    }
]);

intents.matches(/((sergeant)|(sarge)|(seargeant)).*((list)|(lijst)|(-l))/i, [
    function (session) {
        request('https://sotdapi.herokuapp.com/sergeant/list', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                session.send(body); // Show the HTML for the Modulus homepage.
            }
        });
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);