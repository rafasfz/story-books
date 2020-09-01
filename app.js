const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const myPassport = require('./config/passport')
const connectDB = require('./config/db')
const routes = require('./routes')
const authRoutes = require('./routes/auth')
const storiesRoutes = require('./routes/stories')

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
myPassport(passport)

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// Loggin
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

// Handlebars
app.engine('.hbs', exphbs({ defaultLayout: 'main' , extname: '.hbs' }))
app.set('view engine', '.hbs')

// Sessions
app.use(session({
    secret: 'whatever i want',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', routes)
app.use('/auth', authRoutes)
app.use('/stories', storiesRoutes)

// Routes error
app.use((req, res, next) => {
    return res.status(404).render('error/404')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ort ${PORT}`))