const express = require('express')
const mongoose =  require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()
const PORT = process.env.PORT || 5000

//Routes
const usersRoutes = require('./routes/api/users')
const profileRoutes = require('./routes/api/profile')
const postsRoutes = require('./routes/api/posts')

//Mongo Config
const db = require('./config/keys').mongoURI;
mongoose
   .connect(db,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
   .then(() => console.log('MongoDb Connected'))
   .catch(err => console.log('Error in Connecting MongoDB'))

//Body Parser Config
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

//Passport Config
app.use(passport.initialize());
require('./config/passport')(passport)

app.get('/', (req, res) => {
   res.send('Hello')
})

app.use('/api/users', usersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

app.listen(PORT, () => {
   console.log(`The Server Started at Port ${PORT}`)
})