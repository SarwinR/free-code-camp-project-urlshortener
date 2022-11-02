mongoose = require('mongoose')

let urlSchema = new mongoose.Schema({
  index: Number,
    url: String
})

module.exports = mongoose.model('Url', urlSchema)