var express = require('express');
var path = require('path');
var http = require('http');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
app.use('/', routes);

// MySQL
var mysql = require('mysql');
var db = mysql.createConnection({   
    host: 'localhost',
    user: 'guest',
    password: '1111',
    database: 'my_db'
});
db.connect();

var events = [];
var initEvents = false;
var socketCount = 0

io.on('connection', function (socket) { 

 if (!initEvents) {
        db.query('SELECT * FROM events')
            .on('result', function(data){
                // Push results onto the notes array
                events.push(data);
				console.log(events);
            })
            .on('end', function(){
                // Only emit notes after query has been completed
                socket.emit('initial events', events)
            })
 
        initEvents = true;
    } else {
        // Initial notes already exist, send out
        socket.emit('initial events', events);
        socket.emit('next month', events);
    }

socket.on('add_event', function (data) { 
console.log( data); 
data.weekDays = data.weekDays.toString();
console.log( data.weekDays.toString());
console.log( data); 
socketCount++;
console.log(socketCount);

// Пишем data в БД
 db.query('INSERT INTO events set ?', data, function(err, result) { 
     if(err) throw err;
console.log(err); 
console.log(result); 
}); 

 socket.on('disconnect', function() {
        socketCount--
        io.emit('users connected', socketCount)
  })
// Отправляем data клиенту
}) });
 
//     socket.on('new event', function(data){
//         // New note added, push to all sockets and insert into db
//         events.push(data)
//         io.sockets.emit('new event', data)
//         // Use node's db injection format to filter incoming data
//         db.query('INSERT INTO events (title, name, dt_start, dt_end, color) VALUES (?)', data.event)
//     })
 
//     // Check to see if initial query/notes are set
//    
// })

app.get('/calender', function(req, res, next) {
           res.render('calender');
});

// connection.query('SELECT 1 +1 AS solution', function(err, rows, fields){
//     if(err) throw err;
//      console.log('The solution is:', rows[0].solution
// );
// });


module.exports = app;
app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'));
console.log('Connected on port 3000')