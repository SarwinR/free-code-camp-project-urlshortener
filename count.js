mongoose = require('mongoose')

let countSchema = new mongoose.Schema({
    id : String,
    index: Number
})

module.exports = mongoose.model('Count', countSchema)