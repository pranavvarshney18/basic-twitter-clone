const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const morgan = require('morgan');
const db = require('./config/mongoose');

const homeRoutes = require('./routes/home');

//adding layout.ejs
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
//telling that each view can have their own seperate css file, rather than the css file  present in layout.ejs
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(morgan('dev'));

app.use('/', homeRoutes);

//set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');
//telling location of static files (all files in views will be linked relative to this path)
app.use(express.static('./assets'));

app.listen(port, (err) =>{
    if(err){
        console.log(`Error in running the server : ${err}`);
        return;
    }
    console.log(`Server is running on port : ${port}`);
});