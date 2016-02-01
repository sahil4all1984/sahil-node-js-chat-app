module.exports = function(express, app, passport, config, rooms){
	var router = express.Router();

	router.get('/', function(req, res, next){
		res.render('index', {title:'Welcome to Chatcat'});
	})

	
	// redirect to index page is the session does not exists or expire
	function securePages (req, res, next) {
	 	if(req.isAuthenticated()){
	 		next();
	 	} else {
	 		res.redirect('/');
	 	}
	 } 

	router.get('/chatrooms', securePages, function(req, res, next){
		res.render('chatrooms', {title:'Welcome to Chatcat', user:req.user, config:config});
	}) 

	router.get('/room/:id', securePages, function(req, res, next) {
		var room_name = findTitle(req.params.id);
		res.render('room', {user:req.user, room_name:room_name, room_number:req.params.id, config:config})
	}) 

	function findTitle (room_id) {
		var n =0;
		while(n < rooms.length) {
			if(rooms[n].room_number == room_id) {
				return rooms[n].room_name;
				break;
			} else {
				n++;
				continue;
			}
		}
	}

	// login with facebook route
	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/chatrooms',
		failureRedirect : '/',
	}))

	// logout, we are using passport logout method
	router.get('/logout', function(req, res, next) {
		req.logout();
		res.redirect('/');
	});


	// sample routes to see how session works
	router.get('/setcolor', function(req, res, next){
		req.session.favColor = "Blue";
		res.send("Setting favorite color " + req.session.favColor);
	}) 

	router.get('/getcolor', function(req, res, next){
		res.send("My faviote color is : " + (req.session.favColor === undefined 
										? "color not set" : req.session.favColor
									))
	}) 

	app.use('/', router);
}