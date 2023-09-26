import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import methodOverride from 'method-override';
import flash from 'connect-flash';
import passport from 'passport';
import morgan from 'morgan';
import MongoStore from 'connect-mongo';
import { dirname, join } from 'path'; // LLAMO A LOS "ELEMENTOS" ESPECIFICOS DE PATH
import { fileURLToPath } from 'url'; // LLAMOA AL METODO ESPECIFO DE URL

import { MONGODB_URI, PORT } from './config.js'; //LLAMO LOS ELEMENTOS DESDE EL MODULO config.js
import indexRoutes from './routes/index.routes.js'; //LLAMO LOS ELEMENTOS DESDE EL MODULO routes/index.routes.js
import notesRoutes from './routes/notes.routes.js'; //LLAMO LOS ELEMENTOS DESDE EL MODULO routes/index.routes.js
import userRoutes from './routes/auth.routes.js'; //LLAMO LOS ELEMENTOS DESDE EL MODULO routes/index.auth.routes.js
import './config/passport.js';

// Initializations
const app = express(); //INICIALIZO MI SERVIDOR
const __dirname = dirname(fileURLToPath(import.meta.url));

// settings //LO QUE QUIERO QUE HAGA CUANDO
app.set('port', PORT); //ESTABLESCO LA CONFIGURACION PARA UN PUERTO
app.set('views', join(__dirname, 'views'));
//app.set('data', join(__dirname, 'data'));

// config view engine
const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: join(app.get('views'), 'layouts'),
  partialsDir: join(app.get('views'), 'partials'),
  extname: '.hbs',
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// middlewares -SON FUNCIONES Y SE EJECUTAN CUANDO LLEGAN PETICIONES ANTES DE ARRANCAR EL SERVIDOR

//AQUI AGREGAR PARA QUE HAGA EL SPLIT PROBLABLEMENTE

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  //res.locals.horario = VASCIAMENTE GUARDA BD
  next();
});

// routes
app.use(indexRoutes); //IMPORTO LAS RUTAS DE DEFINIDAS EN MODULOS
app.use(userRoutes);
app.use(notesRoutes);

// static files
app.use(express.static(join(__dirname, 'public')));

app.use((req, res, next) => {
  return res.status(404).render('404');
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', {
    error,
  });
});

export default app;
