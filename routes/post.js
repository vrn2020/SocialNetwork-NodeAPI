const express = require("express");
const {getPosts,createPost, postsByUser, postById, isPoster, updatePost, deletePost} = require("../controllers/post");
//const {createPost,getPosts} = require("../controllers/post");
const {requireSignin}  = require ("../controllers/auth");
const {userById}  = require ("../controllers/user");
const {createPostValidator} = require('../validator');

const router = express.Router();

router.get("/",requireSignin, getPosts);

router.post("/post/new/:userId",requireSignin, createPost, createPostValidator);
router.get("/posts/by/:userId", requireSignin, postsByUser);
router.put('/post/:postId', updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);
//any route containing with userId will execute the userById()
router.param("userId", userById);
//any route containing with userId will execute the postById()
router.param("postId",postById);

module.exports = router;