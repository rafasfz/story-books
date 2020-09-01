const { Router } = require('express')

const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')

const router = Router()

// Show add page
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// Porcess add form
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch(err) {
        console.log(err)
        res.render('error/500')
    }
})

module.exports = router