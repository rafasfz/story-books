const { Router } = require('express')

const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')
const Comment = require('../models/Comment')

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
    } catch (err) {
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
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// Show single story
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .populate('comment')
            .lean()

        let comments = await Comment.find({story}).populate('user').lean();

        if(!story) {
            res.render('error/404')
        }

        if (story.user._id != req.user.id && story.status == 'private') {
            res.render('error/404')
          } else {
            res.render('stories/show', {
              story,
              comments
            })
          }
    } catch(err) {
        console.error(err)
        res.render('error/500')
    }
})

// Sdhow edit page
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            if (story.status == 'private') {
                story.privateSelect = true
            }

            res.render('stories/edit', {
                story
            })
        }
    }
    catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// Update sotry
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            return red.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })

            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// Delete storie
router.delete('/:id', ensureAuth, async (req, res) => {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
        return res.render('error/404')
    }

    try {
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            await Story.remove({ _id: req.params.id })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

// User stories
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index', {
            stories
        })
    } catch(err) {
        console.error(err)
        res.render('error/500')
    }
})

// Create a comment
router.post('/:id/comment', ensureAuth, async (req, res) => {
    try {
        const user = req.user.id;
        const story = req.params.id;
        const body = req.body.body;

        await Comment.create({
            user,
            story,
            body,
        });


        res.redirect(`/stories/${story}`);
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router