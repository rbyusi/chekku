const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const logger = require('./middleware/logger_w');
const members = require('./Members');
const dotenv = require('dotenv');



const app = express();

// Init middleware
// app.use(logger);

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Homepage Router
app.get('/', (req, res) =>
  res.render('index', {
    title: 'Member App',
    members
  })
);

app.use((req, res, next)=>{
  logger.info(req.body);
  
  let oldSend = res.send;
  res.send = function(data){
    logger.info(data);
    oldSend.apply(res,arguments);
  }
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Members API Routes
app.use('/api/members', require('./routes/api/members'));
app.use('/api/orders', require('./routes/api/orders'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => logger.log('info',`Server started on port ${PORT}`));
