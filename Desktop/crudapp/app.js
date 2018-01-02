var express = require('express');
var fs = require('fs');
var todoController = require('./controllers/todoController');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('test', ['employeedata']);
var app = express();
var config = fs.readFileSync('config.txt', 'utf-8');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.get('/', function(req, res){
	res.render('index');
});


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



//fire controllers
todoController(app);

app.get('/contact-us', urlencodedParser, function(req, res){
	//console.log(req.body);
	res.render('contact', {qs: req.query});
});




app.post('/contact-us', urlencodedParser, function(req, res){
	console.log(req.body);
	res.render('contact-success', {data: req.body});
	db.employeedata.find({"name": req.body.who, "dept": req.body.department}, function(err, docs){
		console.log(docs);
	
	

	var transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	port: 25,
	auth: {
		user: 'sarkarbidhan59@gmail.com',
		pass: config
	},
	tls: {
		rejectUnauthorized: false
	}
});
	var HelperOptions = {
		from: '"Bidhan Sarkar" <sarkarbidhan59@gmail.com>',
		to: req.body.email,
		subject: 'Corresponding to your query',
		text: docs[0].name + " with email id " + docs[0].email + " works in the domain field " + docs[0].domain
		
	};
	transporter.sendMail(HelperOptions, function(error,info){
		if(error){
			console.log(error);
		}
		console.log("The message was sent");
		console.log(info);
	})
});
});


app.get('/info', function(req, res){
	res.render('info');
})

app.get('/employee/department', function(req, res){
	console.log(req.query);
	res.render('info-success', {data: req.query});
	db.employeedata.aggregate({$group: {_id: '$dept', total: {$sum : 1}}}, function(err, docs){
		console.log(docs);
	





var dt=new function foo(){
this.x = '';
	for(let i=0;i<docs.length;i++)
		{
			this.x += "(" + docs[i].total + " employees in " + docs[i]._id + ")" ;
		}
}


//console.log(dt.x);



	var transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	port: 25,
	auth: {
		user: 'sarkarbidhan59@gmail.com',
		pass: config
	},
	tls: {
		rejectUnauthorized: false
	}
});
	var HelperOptions = {
		from: '"Bidhan Sarkar" <sarkarbidhan59@gmail.com>',
		to: req.query.email,
		subject: 'Corresponding to your query',
		text: dt.x

		
		
		
	};
	transporter.sendMail(HelperOptions, function(error,info){
		if(error){
			console.log(error);
		}
		//console.log("The message was sent");
		console.log(info);
	})
});


})

app.get('/employee/domain', function(req, res){
	console.log(req.query);
	res.render('info-success', {data: req.query});
	db.employeedata.aggregate({$group: {_id: '$domain', total: {$sum : 1}}}, function(err, docs){
		console.log(docs);
	
	var dt=new function foo(){
    this.x = '';
	for(let i=0;i<docs.length;i++)
		{
			this.x += "(" + docs[i].total + " employees in " + docs[i]._id + ")";
		}
}


	var transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	port: 25,
	auth: {
		user: 'sarkarbidhan59@gmail.com',
		pass: config
	},
	tls: {
		rejectUnauthorized: false
	}
});
	var HelperOptions = {
		from: '"Bidhan Sarkar" <sarkarbidhan59@gmail.com>',
		to: req.query.email,
		subject: 'Corresponding to your query',
		text: dt.x
		
	};
	transporter.sendMail(HelperOptions, function(error,info){
		if(error){
			console.log(error);
		}
		console.log("The message was sent");
		console.log(info);
	})
});


})

app.get('/employee', function(req, res){
	res.render('data');
});

app.post('/employee_insert', function(req, res){


	req.checkBody('name','Name is Required').notEmpty();
	req.checkBody('dept','Department is Needed').notEmpty();
	req.checkBody('age','Age is Mandetary').notEmpty();
	req.checkBody('domain','Domain is Required').notEmpty();
	req.checkBody('email','Email is Compulsory').notEmpty();
    
var errors = req.validationErrors();

if(errors){
 
   res.render('data', {
		//title: 'Bidhan',
		//users: users,
		errors: errors
	});
}else{

    var New_Users = {
    	name: req.body.name,
    	dept: req.body.dept,
    	age: req.body.age,
    	domain: req.body.domain,
    	email: req.body.email
    }
    console.log('Data Inserted');
    db.employeedata.insert(New_Users, function(err, result){
    	if(err)
    		console.log(err);
    	res.redirect('/employee');
    });

}
	//console.log(req.body.name + "your Form Submitted");
	//console.log(New_Users);


})


app.put('/employee_update', function(req, res){


	req.checkBody('name','Name is Required').notEmpty();
	req.checkBody('dept','Department is Needed').notEmpty();
	req.checkBody('age','Age is Mandetary').notEmpty();
	req.checkBody('domain','Domain is Required').notEmpty();
	req.checkBody('email','Email is Compulsory').notEmpty();
    
var errors = req.validationErrors();

if(errors){
 
   res.render('data', {
		//title: 'Bidhan',
		//users: users,
		errors: errors
	});
}else{

    console.log('Data Updated');
    db.employeedata.update({"name": req.body.name}, {"name": req.body.name, "dept": req.body.dept, "age": req.body.age, "domain": req.body.domain, "email": req.body.email}, function(err, result){
    	if(err)
    		console.log(err);
    	res.redirect('/employee');
    });

}
	//console.log(req.body.name + "your Form Submitted");
	//console.log(New_Users);


})



app.post('/employee_delete', function(req, res){


	req.checkBody('name','Name is Required').notEmpty();
	req.checkBody('dept','Department is Needed').notEmpty();
	req.checkBody('age','Age is Mandetary').notEmpty();
	req.checkBody('domain','Domain is Required').notEmpty();
	req.checkBody('email','Email is Compulsory').notEmpty();
    
var errors = req.validationErrors();

if(errors){
 
   res.render('data', {
		//title: 'Bidhan',
		//users: users,
		errors: errors
	});
}else{

 
    console.log('Data Deleted');
    db.employeedata.remove({"name": req.body.name}, function(err, result){
    	if(err)
    		console.log(err);
    	res.redirect('/employee');
    });

}
	//console.log(req.body.name + "your Form Submitted");
	//console.log(New_Users);


})

app.use('/profile', express.static('stuff'));
//using params for using the parameters of the route 
/*app.get('/profile/:id', function(req, res){
	res.send('You requested the profile with the Id ' + req.params.id);
});*/


app.get('/profile/:name', function(req, res){
	var data = {age: 25, organization: 'Incture', hobbies: ['eating','chatting','sleeping']};
	res.render('profile', {person: req.params.name, data: data});
});

app.listen(3000, function(){
	console.log("Connecting to 3000.......");
})