var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var catchPhrases = [
	'Hey dude!',
	'Welcome!',
	'Get in touch!',
	'I love you!'
];

app.set('view engine', 'jade');
app.set('view options', { layout: true });
app.set('views', __dirname + '/views');

io.sockets.on('connection', function(socket){
	var sendChat = function(title, text){
		socket.emit('chat', {
			title: title,
			contents: text
		});
	};
	
	setInterval(function(){
		var randomIndex = Math.floor(Math.random()*catchPhrases.length);
		sendChat('Stooge', catchPhrases[randomIndex]);
	}, 5000);
	
	sendChat('Welcome to Stooge Chat', 'The Stooges are on the line');
	socket.on('chat', function(data){
		sendChat('you', data.text);
	});
});

app.get('/stooges/chat', function(req, res, next){
	res.render('chat');
});

app.get('/stooges/:name?', function(req, res, next){
	var name = req.params.name;
	switch(name ? name.toLowerCase() : ''){
		case 'larry':
		case 'moe':
		case 'curly':
			res.render('stooges', { stooge: name });
			break;
		default:
			next();
	}
});

app.get('/stooges/*?', function(req, res){
	res.render('stooges', { stooge: null });
});

app.get('/?', function(req, res){
	res.render('index');
});

var port = 8080;
server.listen(port);
console.log('Listening on port ' + port);
