const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')

const myPassport = require('./config/passport')
const connectDB = require('./config/db')
const routes = require('./routes')
const authRoutes = require('./routes/auth')

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
myPassport(passport)

connectDB()

const app = express()

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
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', routes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ort ${PORT}`))