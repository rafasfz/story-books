const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')

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

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

// Loggin
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon
    },
    defaultLayout: 'main' ,
    extname: '.hbs' 
}))
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

// Set global var
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
}) 

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

const PORT = process.env.PORT || 3333

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
