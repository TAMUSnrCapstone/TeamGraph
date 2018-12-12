let mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId;

let algorithmSchema = new mongoose.Schema({
    name: String,
    blocks: {type:Array, default: []},
    answer: {type: Object, default: []}
});

module.exports = mongoose.model('Algorithm', algorithmSchema);