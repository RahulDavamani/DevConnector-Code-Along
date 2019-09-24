const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
//Models
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
//Validator
const validatePostInput = require('../../validation/post')

//@route GET api/posts/test
//@desc Tests posts Route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Route Works' }))

//Get All Post
//@route GET api/posts
router.get('/', (req, res) => {
   //Find all Post
   Post.find()
      .sort({date: -1})
      .then(posts => res.json(posts))
      .catch(err => res.status(404).json({noPosts: 'No Posts Found'}))
})

//Get Post by ID
//@route GET api/posts/:id
router.get('/:id', (req, res) => {
   //Find Post by ID
   Post.findById(req.params.id)
      .then(post => res.json(post))
      .catch(err => res.status(404).json({ noPost: 'No Post Found' }))
})

//Create Post
//@route POST api/posts
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => { 
     
   // Validation
   const { errors, isValid } = validatePostInput(req.body)
   if(!isValid) {
      return res.status(400).json(errors);
   }

   const { text, name, avatar } = req.body
   const user = req.user.id;
   const newPost = new Post({ text, name, avatar, user })

   newPost.save()
      .then(post => res.json(post))   
})

//Add Comment
//@route POST api/posts/:id/comment
router.post('/:id/comment', passport.authenticate('jwt', {session: false}), (req, res) => {
        
   // Validation
   const { errors, isValid } = validatePostInput(req.body)
   if(!isValid) {
      return res.status(400).json(errors);
   }

   const user = req.user.id;
   //Find Post
   Post.findById(req.params.id)
      .then(post => {
         //Create Comment
         const { text, name, avatar} = req.body
         const newComment = { text, name, avatar, user}

         //Add Comment to post
         post.comment.unshift(newComment)
         post.save()
            .then(post => res.json(post))
      })
      .catch(err => res.status(404).json({ noPost: 'Post Not Found'}))
})

//Like Post
//@route POST api/posts/:id/like
router.post('/:id/like', passport.authenticate('jwt', {session: false}), (req, res) => {
   const user = req.user.id;
   //Get Profile
   Profile.findOne({user})
   .then(profile => {
      //Get Post
      Post.findById(req.params.id)
         .then(post => {
            //Check whether the User already Liked
            if(post.likes.filter(like => like.user.toString() === user).length > 0){
               return res.status(400).json({ alreadyLiked: 'User Already Liked this Post' })
            }
            //Add user to likes
            post.likes.unshift({ user });
            post.save()
               .then(post => res.json(post))
         })
         .catch(err => res.status(404).json({noPost: 'No Post Found'}))
   })
})

//UnLike Post
//@route POST api/posts/:id/unlike
router.post('/:id/unlike', passport.authenticate('jwt', {session: false}), (req, res) => {
   const user = req.user.id;
   //Get Profile
   Profile.findOne({user})
   .then(profile => {
      //Get Post
      Post.findById(req.params.id)
         .then(post => {
            //Check whether the User Liked
            if(post.likes.filter(like => like.user.toString() === user).length == 0){
               return res.status(400).json({ notLiked: 'User has not Liked this Post' })
            }
            //Remove like
            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(user);
            post.likes.splice(removeIndex, 1)

            post.save()
               .then(post => res.json(post))
         })
         .catch(err => res.status(404).json({noPost: 'No Post Found'}))
   })
})

//Delete Post by ID
//@route DELETE api/posts/:id
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
   const user = req.user.id;
   //Get Profile
   Profile.findOne({user})
      .then(profile => {
         //Get Post
         Post.findById(req.params.id)
            .then(post => {
               //Check for Post Owner
               if(post.user.toString() !== user){
                  return res.status(401).json({ notAuthorized: 'User not Authorized' })
               }
               //Delete
               post.remove()
                  .then(() => res.json({ success: true }))
            })
            .catch(err => res.status(404).json({noPost: 'No Post Found'}))
      })
})

//Delete Comment 
//@route DELETE api/posts/:id/comment/:comment_id
router.delete('/:id/comment/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
   Post.findById(req.params.id)
      .then(post => {
         //Check Comment Exists
         if(post.comment.filter(comment => comment._id.toString()===req.params.comment_id).length === 0){
            return res.status(404).json({ noComment: 'Comment not Found'})
         }
         
         //Delete Comment
         const removeIndex = post.comment.map(item => item._id.toString()).indexOf(req.params.comment_id)
         post.comment.splice(removeIndex, 1)
         post.save()
            .then(post => res.json(post))
      })
   .catch(err => res.status(404).json({noPost: 'No Post Found'}))
})

module.exports = router