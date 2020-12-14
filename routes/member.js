const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {validateMember, Member} = require('../module/member');




router.get('/', async (req, res) => {
    const members = await Member.find().sort('name');
    res.locals.members = members;
    res.render("members/show");
});

router.post('/', async (req,res) => {
    const {error} = validateMember(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const member = new Member({
        name: req.body.name,
        isPremium: req.body.isPremium,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email
    });

    const result = await member.save();
   console.log(result);
   res.send(result);
});

router.put('/:id', async (req, res) => {
    const {error} = validateMember(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let member = await Member.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isPremium: req.body.isPremium,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email}, {new: true});
    if (!member) return res.status(404).send('The member you are looking for is not find');
    res.send(member);
});

router.delete('/:id', async (req,res) => {
    const member = await Member.findByIdAndRemove(req.params.id);
    if (!member) return res.status(404).send('Not find');
    res.send(member);
});

module.exports = router;