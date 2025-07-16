const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
    // the password and username field is added by passport-local-mongoose by default
});


UserSchema.plugin(passportLocalMongoose);//it will automatically add the hashing,salting in the password field

module.exports = mongoose.model("User", UserSchema);