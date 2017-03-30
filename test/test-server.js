const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, closeServer, runServer} = require("../server");

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function(){
	//Starts the server and returns a promise
	//to avoid race conditions
	before(function(){
		return runServer();
	});

	//Stops the server after tests so if we add
	//another test module, it won't still be running
	after(function(){
		return closeServer();
	});

	//test strategy:
	//make GET request to /blog-posts
	//inspect response object to verify keys
	it("should return blog posts on GET", function(){
		return chai.request(app)
		.get("/blog-posts")
		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a("array");
			//we create 3 posts on app load
			res.body.length.should.be.at.least(1);
			const expectedKeys = ["id", "title", "content", "author", "publishDate"];
			res.body.forEach(function(post){
				post.should.be.a("object");
				post.should.include.keys(expectedKeys);
			});
		});
	});

	//test strategy:
	//make post request with new blog post
	//verify that response status is correct
	//and it has a new "id"
	it("should add a new post on POST", function(){
		const newPost = {title: "testTitle", author:"testAuthor", content: "testContent"};
		return chai.request(app)
		.post("/blog-posts")
		.send(newPost)
		.then(function(res){
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a("object");
			res.body.should.include.keys("id", "title", "author", "content", "publishDate");
			res.body.id.should.not.be.null;
			//need to add the id and publishDate from the response to check for deep equality
			res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
		});
	});

	//test strategy:
	//make an update post object - we don't have an ID or publishdate though
	//make a GET request to get an ID and publishdate
	//add the id to the update post
	//make a PUT request with the update post plus ID and publishdate
	//inspect response for status and body
	it("should update posts on PUT", function(){
		const updatedPost = {title:"Update", author:"Matthew", content:"updated content"};
		return chai.request(app)
		.get("/blog-posts")
		.then(function(res){
			updatedPost.id = res.body[0].id;
			updatedPost.publishDate = res.body[0].publishDate;
			return chai.request(app)
			.put(`/blog-posts/${updatedPost.id}`)
			.send(updatedPost);
		})
		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a("object");
			res.body.should.deep.equal(updatedPost);
		});
	});

	//test strategy:
	//make a get request to get a post id
	//perform a delete request with that id
	//check to make sure we get a 204 status
	it("should delete posts on DELETE", function(){
		return chai.request(app)
		.get("/blog-posts")
		.then(function(res){
			return chai.request(app)
			.delete(`/blog-posts/${res.body[0].id}`);
		})
		.then(function(res){
			res.should.have.status(204);
		});
	});
	
});