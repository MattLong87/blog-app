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
});

router.post("/", jsonParser, (req, res) => {
	const title = req.body.title;
	const content = req.body.content;
	const author = req.body.author;
	const publishDate = req.body.publishDate;
	const post = BlogPosts.create(title, content, author, publishDate);
	if (post.error){
		return res.status(500).json(post);
	}
	res.status(201).json(post);
});

router.delete("/:id", (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted post with ID \`${req.params.id}\``);
	res.status(204).end();
});

router.put("/:id", jsonParser, (req, res) => {
	const requiredFields = ["title", "author", "content", "id"];
	for (let i = 0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if (!(field in req.body)){
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id){
		const message = `Request path id \`${req.params.id}\` and body id \`${req.body.id}\` must match.`;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating post \`${req.params.id}\``);
	const updatedPost = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		author: req.body.author,
		content: req.body.content
	});
	res.status(200).json(updatedPost);
});

module.exports = router;