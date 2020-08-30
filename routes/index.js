const { Router } = require('express')

const router = Router()

// Login/Landding page
router.get('/', (req, res) => {
    res.render('login')
})

// Dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

module.exports = router