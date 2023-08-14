const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const morgan = require('morgan');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//for session-cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets  = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');


app.use(express.urlencoded({extended:false}));
// app.use(bodyParser.urlencoded({extended: false})); //true allows me to parse extended bodies with rich data in it
// app.use(bodyParser.json());


const homeRoutes = require('./routes/home');

//setting up sass/scss
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    // debug: true,
    outputStyle: 'extended', 
    prefix: '/css'
}));
//telling location of static files (all files in views will be linked relative to this path)
app.use(express.static('./assets'));

//adding layout.ejs
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
//telling that each view can have their own seperate css file, rather than the css file  present in layout.ejs
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// app.use(morgan('dev'));
//telling express to use cookie parser
app.use(cookieParser());

//make the uploads path visible to browser
app.use('/uploads', express.static(__dirname + '/uploads'));


//set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');


//encripting cookie
app.use(session({
    name: 'twitter_clone',
    secret: 'something',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100) //100min
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: "disabled",
    },
    (err) => {
        if(err) console.log("error in MongoStore setup", err);
    }
    )
}));
app.use(passport.initialize());
app.use(passport.session());

//user can be accessable in views (we have set locals.user in checkAuthentication middleware in passport config)
app.use(passport.setAuthenticatedUser); // now locals.user can be used in views

//initialize flash-connect
app.use(flash());
app.use(customMware.setFlash);


app.use('/', homeRoutes);


app.listen(port, (err) =>{
    if(err){
        console.log(`Error in running the server : ${err}`);
        return;
    }
    console.log(`Server is running on port : ${port}`);
});