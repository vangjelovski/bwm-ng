const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
username: {
    type: String,
    min: [4, 'To short bro'],
    max: [32, 'To much chars bro']
},
email: {
    type: String,
    min: [4, 'To short bro'],
    max: [32, 'To much chars bro'],
    unique: true,
    lowercase: true,
    require : 'Mail is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
},
password: {
    type : String,
    min: [4, 'To short bro'],
    max: [32, 'To much chars bro'],
    required: 'Password is required'
},
rentals: [{type: Schema.Types.ObjectId, ref: 'Rental' }]
});

userSchema.methods.hasSamePassword = function(requestedPassword) {
    return bcrypt.compareSync(requestedPassword, this.password);
}

userSchema.pre('save', function(next){
    const user = this;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
            // Store hash in your password DB.
        });
    });
})


module.exports = mongoose.model('User', userSchema);
