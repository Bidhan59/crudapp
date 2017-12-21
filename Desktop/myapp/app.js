var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('test', ['testcollection']);

var app = express();
//app.use(expressValidator(middlewareOptions));


var logger1 = function(req, res, next){
	console.log("logging.....");
	next();
}
app.use(logger1);


app.set('view engine', 'ejs');
//app.set('view engine', 'html');       //doesnot work
app.set('views', path.join(__dirname,'views'));
 
//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));




//Set Static Path
//app.use(express.static(path.join(__dirname, 'public')));


/*var people = [
{
	name: 'Bidhan',
	age: 25
},
{
    name: 'Abhijit',
    age: 27
},
{
	name: 'Siddhart',
	age: 30
}
]*/
//app.use(express Validator)

//Global Variable
app.use(function(req, res, next){

res.locals.errors = null;
next();

});

// Express Validator Middleware

app.use(expressValidator({
 
 errorFormatter: function(param, msg, value){
 	var namespace = param.split('.')
 	, root = namespace.shift()
 	, formParam = root;

 	while(namespace.length){
 		formParam += '[' + namespace.shift() + ']'; 
 	}
 	return{
 		param : formParam,
 		msg : msg,
 		value : value
 	};

 }


}));

/*var users = [
{
	id: 1,
	name: 'Bidhan',
	age: 25
},
{
	id: 2,
	name: 'Abhijit',
	age: 26
},
{
	id: 3,
	name: 'Siddhart',
	age: 25
}];
*/
app.get('/', function(req, res){

	//res.send('Hello World');
	//res.json(people);

//res.send("Old Customers");
db.testcollection.find(function (err, docs) {
	// docs is an array of all the documents in mycollection
	console.log(docs);
	res.render('index', {
		title: 'Bidhan',
		users: docs
	});
})
	
});

var logger = function(req, res, next){
	console.log("checking data.....");
	next();
}
app.use('/users', logger);


app.post('/users/add', function(req, res){

	req.checkBody('name','Name is Required').notEmpty();
	req.checkBody('age','Age is Mandetary').notEmpty();
	req.checkBody('email','Email is Compulsory').notEmpty();
    
var errors = req.validationErrors();

if(errors){
 
   res.render('index', {
		title: 'Bidhan',
		users: users,
		errors: errors
	});
}else{

    var New_Users = {
    	name: req.body.name,
    	age: req.body.age,
    	email: req.body.email
    }
    console.log('Form Submitted');
    db.testcollection.insert(New_Users, function(err, result){
    	if(err)
    		console.log(err);
    	res.redirect('/');
    });

}
	//console.log(req.body.name + "your Form Submitted");
	//console.log(New_Users);


})



app.listen(3000, function(){
	console.log("Server started at port 3000...");
})