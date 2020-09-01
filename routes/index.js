const { Router } = require('express')

const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')

const router = Router()

// Login/Landding page
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// Dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        stories.forEach(story => {
            if(story.status == 'public') story.status = 'Pública'
            else if(story.status == 'private') story.status = 'Privada'
        })
        res.render('dashboard', { 
            name: req.user.firstName,
            stories
         })
    } catch(err) {
        console.error(err)
        res.render('error/500')
    }

    
})

module.exports = router