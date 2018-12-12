let mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId;

let userSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    firstName: String,
    lastName: String,
    completedChapters: {
        type: Array,
        'default': []
    }
})

userSchema.statics.findOneOrCreate = function findOneOrCreate(condition, doc, callback) {
    const self = this
    self.findOne(condition, (err, result) => {
        return result ? callback(err, result) : self.create(doc, (err, result) => { return callback(err, result) })
    })
}

userSchema.statics.findOneById = function(id,callback) {
    return this.findOne({googleId : id}, (err,result) => {
        return callback(err,result);
    })
}

module.exports = mongoose.model('User', userSchema)