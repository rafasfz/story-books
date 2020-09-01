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
        console.error(err)
        res.render('error/500')
    }
})

// Show all public stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('stories/index', { stories })
    } catch(err) {
        console.error(err)
        res.render('error/500')
    }
})

// Sdhow edit page
router.get('/edit/:id', ensureAuth, async (req, res) => {
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()

    if(!story) {
        return res.render('error/404')
    }

    if (story.user != req.user.id) {
        res.redirect('/stories')
    } else {
        if(story.status == 'public') {
            story.publicSelect = true
        } else {
            story.privateSelect = true
        }

        res.render('stories/edit', {
            story
        })
    }
})

// Update sotry
router.put('/:id', ensureAuth, async (req, res) => {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
        return red.render('error/404')
    }

    if (story.user != req.user.id) {
        res.redirect('/stories')
    } else {
        if(story.status == 'public') {
            story.publicSelect = true
        } else {
          story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
              new: true,
              runValidators: true
          })

          res.redirect('/dashboard')
        }
    }
})
module.exports = router