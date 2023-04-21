const { Schema, model, models } = require("mongoose");
const authuserSchema = new Schema({
    walletId: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,

    }




})
module.exports = model("authUser", authuserSchema);

