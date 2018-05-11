//including the dependencies
var bodyParser 	= require("body-parser"),
methodOverride	= require("method-override"),
express 		= require('express'),
expressSanitizer= require("express-sanitizer"),	//doesn't allow user to enter harmful scripts
mongoose 		= require("mongoose"),
passport 		= require("passport");
LocalStrategy	= require("passport-local"),
User 			= require("./models/user"),
app 			= express();



//=================tell the app to use the following==============
app.set("view engine","ejs");
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(methodOverride("_method"))		// PUT, DELETE 

//	MONGOOSE /MODEL CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: { type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//===================================================
//	PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Rusty wins",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
	req.body.blog.body = req.sanitize(req.body.blog.body) //act as a middleware
	Blog.findByIdAndUpdate(req.params.id,  req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}	else{
			res.redirect("/blogs/" + req.params.id);
		}
	})	//Blog.findByIdAndUpdate() takes in 3 parameters (id, newData, callback)
});

//======================================================
//DELETE ROUTE 
app.delete("/blogs/:id", function(req, res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		}	else{
			res.redirect("/blogs");
		}
	})
	//redirect somewhere
});
 
//=====================================================
//AUTH ROUTES

//show register form
app.get("/register", function(req, res){
	res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/blogs");
		});
	});
});

// show login form
app.get("/login", function(req, res){
	res.render("login");
});

// handle login up logic
// app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local", 
		{
			successRedirect: "/blogs",
			failureRedirect: "/login"
		}), function(req, res){
	res.send("Logged in");
});


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server is running!!");
})