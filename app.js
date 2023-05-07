// Configurar variables de entorno
var dotenv = require('dotenv');
dotenv_path = './env/.env';
dotenv.config({path: dotenv_path});

// App
var express = require('express');  
app = express();

// Usar JSON
app.use(express.json());

// Recursos
app.use(express.static(__dirname + '/public'));

// Configurar plantillas
app.set('view engine', 'ejs');
app.set('views', './app/views');

// Configurar carpeta de archivos estáticos
app.use('/recursos', express.static(__dirname + '/public'));

// Set the base URL for all links and assets
app.locals.baseUrl = 'http://localhost:3000/';

// Configurar rutas
var routes = require('./app/routes/appRoutes.js').routes; //importing route
routes(app); //register the route

// Servidor
var port = process.env.SERVER_PORT;
app.listen(port);
console.log('API server started on: ' + port);