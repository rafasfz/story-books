const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Comment', StorySchema)