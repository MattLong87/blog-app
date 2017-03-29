const express = require("express");
//Morgan for logging HTTP layer
const morgan = require("morgan");
//body-parser's json() method to parse JSON
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

//Router for handling blog posts
const blogPostsRouter = require("./blogPostsRouter");

const app = express();

//log the http layer
app.use(morgan('common'));

app.use('/blog-posts', blogPostsRouter);
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
})

app.listen(process.env.PORT || 8080, () => {
	console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});