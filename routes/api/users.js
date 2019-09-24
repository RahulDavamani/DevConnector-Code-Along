//Express
const express = require('express');
const router = express.Router();
//Packages
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
//Model
const User = require('../../models/User')
//keys
const secretKey = require('../../config/keys').secretOrKey
//validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')


//@route GET api/users/test
//@desc Tests users Route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Users Route Works' }))

//@route POST api/users/register
//@desc Register User
//@access Public
router.post('/register', (req, res) => {

   //Validation
   const { errors, isValid } = validateRegisterInput(req.body)
   if(!isValid) {
      return res.status(400).json(errors);
   }

   const { name, email, password } = req.body
   //Find User
   User.findOne({email})
      .then( user => {
         //Check User Exists
         if(user){
            errors.email = 'Email Already Exists'
            return res.status(400).json(errors)
         } else {
            //Create User
            const avatar = gravatar.url(email, {
               s: '200',
               r: 'pg',
               d: 'mm'
            })
            const newUser = new User({
               name,
               email,
               password,
               avatar
            })

            //Encrypt Password
            bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if(err) throw err;
                  newUser.password = hash;
                  newUser.save()
                     .then(user => res.json(user))
                     .catch(err => console.log(err))
               })
            })
         }
      })
      .catch(err => console.log(err))
})

//@route POST api/users/login
//@desc Login User
//@access Public
router.post('/login', (req, res) => {
   
   //Validation
   const { errors, isValid } = validateLoginInput(req.body)
   if(!isValid) {
      return res.status(400).json(errors);
   }
   
   const {email, password} = req.body;
   //Find User
   User.findOne({email})
      .then(user => {
         //Check User
         if(!user){
            errors.email = 'User not Found'
            return res.status(404).json(errors)
         }
         //Check Password
         bcrypt.compare(password, user.password)
            .then(isMatch => {
               if(isMatch){
                  //Create JWT Payload
                  const { id, name, avatar } = user;
                  const payload = {id, name, avatar};
                  //Generate JWT Token
                  jwt.sign(
                     payload,
                     secretKey,
                     {expiresIn: 3600}, 
                     (err, token) => {
                     res.json({
                        success: 'true',
                        token: `Bearer ${token}`
                     })
                  });
               } else {
                  errors.password = 'Password Incorrect'
                  return res.status(400).json(errors)
               }
            })
      })
})

//@route GET api/users/current
//@desc return Current User
//@access Private

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
   const { id, name, email } = req.user
   res.json( {id, name, email})
})

module.exports = router