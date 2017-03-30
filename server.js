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

//Starts server, and returns a promise
function runServer(){	
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		server = app.listen(port, () => {
			console.log(`Your app is listening on port ${port}`);
			resolve(server);
		}).on("error", err => {
			reject(err);
		});
	});
};

//Stops server and returns a promise
function closeServer(){
	return new Promise((resolve, reject) => {
		console.log("Closing server");
		server.close(err => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
};

//starts the server if server.js is called directly
//but allows tests to call runServer() as needed
if (require.main === module){
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};