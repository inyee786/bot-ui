// app/routes.js
const db = require('../config/schema')

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	})
	);

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/update', function(req, res) {
	db.repos.findByIdAndUpdate(req.body._id,{$set:{token:req.body.token, curlUrl:req.body.curlUrl,ref:req.body.ref}} ,(err,resp) =>{
		if(err){
			console.log("err")
			db.repos.collection.find().toArray(function(err, results) {
				if (err) return console.log(err)
				// renders repositories.ejs
				res.render('repositories.ejs', {repositories: results,message: 'failed to update', id:req.body._id, success:0})
			  })
		}else{
			db.repos.collection.find().toArray(function(err, results) {
				if (err) return console.log(err)
				// renders repositories.ejs
				res.render('repositories.ejs', {repositories: results,message: 'Data is update', id:req.body._id, success:1 })
			  })
		}
	})		
	});
  

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	app.get('/repositories',isLoggedIn, function(req, res) {
		db.repos.collection.find().toArray(function(err, results) {
			if (err) return console.log(err)
			// renders repositories.ejs
			res.render('repositories.ejs', {repositories: results,message:'',id:'test',success:0})
		  })
	});
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
