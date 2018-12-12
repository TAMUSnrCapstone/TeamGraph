let mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId;

let chapterSchema = new mongoose.Schema({
    title: String,
    path: String,
    sections: {type: Array, default: []},
});

module.exports = mongoose.model('Chapter', chapterSchema);