const {Schema, model} = require("mongoose");

const MemberSchema = new Schema({
    id: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    roleType: {type: String, required: true, enum: ['HOST, GUEST'], default: "GUEST"}
})

const Member = model("Member", MemberSchema)
module.exports = {Member}