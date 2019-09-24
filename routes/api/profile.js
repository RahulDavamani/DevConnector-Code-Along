const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
//Models
const Profile = require('../../models/Profile')
const User = require('../../models/User')
//Validator
const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')

//Test Route
//@route GET api/profile/test
router.get('/test', (req, res) => res.json({ msg: 'Profile Route Works' }));

//Get the Profile of Current User
//@route GET api/profile
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
   const errors = {};
   const {id} = req.user;
   Profile.findOne({ user: id })
   .populate('user', ['name', 'avatar'])
      .then(profile => {
         if(!profile){
            errors.noProfile = 'There is no Profile for this User';
            return res.status(404).json(errors)
         }
         res.json(profile)
      })
      .catch(err => res.status(404).json(err))
})

//Get the Profile by handle
//@route GET api/profile/handle/:handle
router.get('/handle/:handle', (req, res) => {
   const errors = {}
   const { handle } = req.params;
   Profile.findOne({handle})
      .populate('user', ['name', 'avatar'])
      .then(profile => {
         if(!profile) {
            errors.noProfile = 'There is no Profile for this User'
            res.status(404).json(errors);
         }

         res.json(profile)
      })
      .catch(err => res.status(404).json(err))
})

//Get the Profile by ID
//@route GET api/profile/user/:id
router.get('/user/:id', (req, res) => {
   const errors = {}
   const { id } = req.params;
   Profile.findOne({user: id})
      .populate('user', ['name', 'avatar'])
      .then(profile => {
         if(!profile) {
            errors.noProfile = 'There is no Profile for this User'
            res.status(404).json(errors);
         }

         res.json(profile)
      })
      .catch(err => res.status(404).json({profile: 'There is no profile for this User'}))
})

//Get the all Profile
//@route GET api/profile/all
router.get('/all', (req, res) => {
   const errors = {}
   Profile.find()
      .populate('user', ['name', 'avatar'])
      .then(profiles => {
         if(!profiles) {
            errors.noProfiles = 'There are no Profiles'
            res.status(404).json(errors);
         }
         res.json(profiles)
      })
      .catch(err => res.status(404).json({profile: 'There are no profile'}))
})

//Create or Edit User Profile
//@route POST api/profile
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
   
   //Validation
   const { errors, isValid } = validateProfileInput(req.body)
   if(!isValid) {
      return res.status(400).json(errors);
   }

   const {id} = req.user
   const profileFields = {};
   profileFields.user = id

   if(req.body.handle) profileFields.handle = req.body.handle
   if(req.body.company) profileFields.company = req.body.company
   if(req.body.website) profileFields.website = req.body.website
   if(req.body.location) profileFields.location = req.body.location
   if(req.body.bio) profileFields.bio = req.body.bio
   if(req.body.status) profileFields.status = req.body.status
   if(req.body.githubusername) profileFields.githubusername = req.body.githubusername
   //Skills
   if(typeof req.body.skills !== undefined) {
      profileFields.skills = req.body.skills.split(',')
   }
   //Social
   profileFields.social = {}
   if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
   if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
   if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
   if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
   if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

   //Create or Update
   Profile.findOne({user: id})
      .then(profile => {
         if(profile){
            //Update
            Profile.findOneAndUpdate({ user: id }, { $set: profileFields }, { new: true })
               .then(profile => res.json(profile))
         } else {
            //Create
            Profile.findOne({handle: profileFields.handle})
               .then(profile => {
                  if(profile){
                     errors.handle = 'That handle Already Exists'
                     res.status(400).json(errors);
                  }

                  new Profile(profileFields)
                     .save()
                     .then(profile => res.json(profile))
               })
         }
      })
      .catch(err => res.status(400).json(err))
})

//Add Experience to a Profile
//@route POST api/profile/experience
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {

   //Validation
   const { errors, isValid } = validateExperienceInput(req.body)
   if(!isValid) {
      return res.status(400).json(errors);
   }
   
   const { id } = req.user;
   Profile.findOne({ user: id })
      .then(profile => {
         const { title, company, location, from, to, current, description } = req.body;
         const newExp = { title, company, location, from, to, current, description}

         profile.experience.unshift(newExp);
         profile.save()
            .then(profile => res.json(profile))
      })
})

//Add Education to a Profile
//@route POST api/profile/education
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {

   //Validation
   const { errors, isValid } = validateEducationInput(req.body)
   if(!isValid) {
      return res.status(400).json(errors);
   }
   
   const { id } = req.user;
   Profile.findOne({ user: id })
      .then(profile => {
         const { school, degree, fieldOfStudy, from, to, current, description } = req.body;
         const newExp = { school, degree, fieldOfStudy, from, to, current, description}

         profile.education.unshift(newExp);
         profile.save()
            .then(profile => res.json(profile))
      })
})

//Delete Experience to a Profile
//@route Delete api/profile/experience/:id
router.delete('/experience/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
   Profile.findOne({user: req.user.id })
      .then(profile => {
         const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.id);
         if(removeIndex >= 0){
            profile.experience.splice(removeIndex, 1);
         }
         profile.save()
         .then(profile => res.json(profile))
      })
      .catch(err => res.status(404).json(err))
})

//Delete Education to a Profile
//@route Delete api/profile/education/:id
router.delete('/education/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
   Profile.findOne({user: req.user.id })
      .then(profile => {
         const removeIndex = profile.education.map(item => item.id).indexOf(req.params.id);
         if(removeIndex >= 0){
            profile.education.splice(removeIndex, 1);
         }
         profile.save()
         .then(profile => res.json(profile))
      })
      .catch(err => res.status(404).json(err))
})

//Delete User and Profile
//@route Delete api/profile
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
   Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {         
         User.findOneAndRemove({ _id: req.user.id})
         .then(() => res.json({success: true}))
      })
})

module.exports = router