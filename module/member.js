const mongoose = require('mongoose');
const Joi = require('joi');

const memberSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 255,
        minlength: 5
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String,
        required: true,
        maxlength:10,
        minlength: 10,
    },
    email: {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 5
    }
});

const Member = mongoose.model('Members', memberSchema);

function validateMember (member) {
    const schema = {
        name: Joi.string().min(5).required(),
        isPremium: Joi.boolean().required(),
        phoneNumber: Joi.string().max(10).min(10).required(),
        email: Joi.string().min(5).required()
    };
    return Joi.validate(member, schema);
};

module.exports.validateMember = validateMember;
module.exports.Member = Member;
module.exports.memberSchema = memberSchema;