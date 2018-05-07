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

//	NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
}); 

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server is running!!");
})