//including the dependencies
var express = require('express'),
bodyParser 	= require("body-parser"),
mongoose 	= require("mongoose"),
app 		= express();

app.set("view engine","ejs");
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//	MONGOOSE /MODEL CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: { type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//	RESTful Routes
app.get("/", function(req, res){
	res.render("index");
}); 
//===================================================
//	INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR!!");
		}
		else{
			res.render("index", {blogs: blogs});
		}
	});
}); 
//===================================================
//	NEW ROUTE 	(get request)
app.get("/blogs/new", function(req, res){
	res.render("new");
}); 
 
//	CREATE ROUTE 	(post request)
app.post("/blogs",function(req, res){
	//	create blog
	Blog.create(req.body.blog, function(err, newBlog){	//.blog contains all title, image, body since name specified  in form in that manner
		if(err){
			res.render("new");
		}	else{
			//	then redirect to index
			res.redirect("/blogs");
		}
	});
});
//===================================================
//	SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}	else{
			res.render("show", {blog: foundBlog});	//to show template we are sending blog as a parameter which contains blog id caught by foundBlog
		}
	})
});
//===================================================
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}	else {
			res.render("edit", {blog: foundBlog}); 
		}
	});
});
//====================================================
//UPDATE ROUTE 	(put request)
app.put("/blogs/:id", function(req, res){
	res.send("UPDATE");
});



app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server is running!!");
})