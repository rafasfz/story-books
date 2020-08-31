const { Router } = require('express')

const { ensureAuth, ensureGuest } = require('../middleware/auth')

const router = Router()

// Login/Landding page
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// Dashboard
router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard')
})

module.exports = router