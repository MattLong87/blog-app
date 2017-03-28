const express = require('express');
const router = express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

//BlogPosts model is already built for us
const {BlogPosts} = require("./models");

//sample blog posts so we have some data. 
//data is being held in memory because we
//haven't learned databases yet
BlogPosts.create("My first post","This is my first post. It's pretty boring", "Matthew");
BlogPosts.create("Second post", "This is the second post. It's not much better", "Matthew");
BlogPosts.create("Third post", "Third post. Still about the same", "Matthew");

router.get("/", (req, res) => {
	res.json(BlogPosts.get());
})

module.exports = router;