var express = require('express');
var passport = require('passport');
var Account = require('../models/user-schema');
var post = require('../models/tutorial-schema');
var comment = require('../models/comment-schema');
var message = require('../models/message-schema');
var router = express.Router();
var check = "";
check = "false";


router.get('/', function (req, res)
 {
    if(req.user)
     {
        res.render('index', { user : req.user,
                              title: "Online Academics tutorial"
                            });
     }
    else
     {
        res.render('login', { title: 'Login' });
     }

 });

router.get('/register', function(req, res)
 {
    res.render('register', { user : req.user,
                          title: "Register || CpE Room Management System" 
                        });
 });

router.post('/register', function(req, res)
 {

	var newUser = { username: req.body.username,
					email: req.body.email,
					first_name: req.body.firstname,
					last_name: req.body.lastname,
                    course: req.body.course,
                    guild: req.body.guild,
                    admin: false
				  }

    Account.findOne({username: newUser.username}, function(err, getUsername){
    if(!getUsername) {
      Account.register(new Account(newUser), req.body.password, function(err, account){
        if (err)
         {
            console.log(err.toString());
            res.render('register', { account : account,
            					  errorRegistration: err.toString(),
            					  title: "Register || To-Do List"
            				    });
         }

        passport.authenticate('local')(req, res, function ()
         {
            res.redirect('/');
         });
      });
    }
    else {
      console.log('Username already exists!')
      res.redirect('/register');
    }
  });
 });

router.get('/login', function(req, res)
 {
    res.render('login', { user : req.user,
    				      title: "Login || To-Do List" 
    					});
 });

router.post('/login', function(req, res, next)
 {
    passport.authenticate('local', function(err, user)
     {
        if(!err)
         {
            if(!user)
             {
                console.log('Invalid username or password!');
                res.redirect('/');
             }
            else
             {
                req.logIn(user, function(err)
                 {
                    if(!err)
                     {
                        res.redirect('/');
                        console.log('Login success!');
                        console.log(user.admin)
                     }
                    else
                     {
                        console.log(err.toString());
                        res.end(err);
                     }
                 })
             }
         }
         
        else
         {
            console.log(err.toString());
            res.end(err);
         }
     })(req, res, next);
 });

router.post('/logout', function(req, res)
 {
    req.logout();
    res.redirect('/');
 });

router.get('/addTutorial', function(req, res)
 {
    res.render('addTutorial',
    { 
        user : req.user,
        title: "Add Tutorial"
    });
 });

router.get('/addMessage', function(req, res) {
  var userGuild = req.user.guild;
  console.log(userGuild);
  Account.find({guild: userGuild}, function(err, users) {
    res.render('addMessage',
    { 
        user: req.user,
        Account: users,
        title: "Add Message"
    });
  });
 });

router.get('/viewTutorialCircuits', function(req, res) {
  check = "false";
  console.log(check);
  post.find({guild: "Circuits Guild"}, function(err, tutorials) {
  post.find({guild: "Circuits Guild"}, function(err, tutorial) {
    console.log('Tutorials Loaded!');
    res.render('viewTutorials', {
      title: 'All Tutorials',
      user: req.user,
      post: tutorial,
      posts: tutorials
    });
  });
  });
});

router.get('/viewTutorialElectronics', function(req, res) {
  post.find({guild: "Electronics Guild"}, function(err, tutorial) {
    console.log('Tutorials Loaded!');
    res.render('viewTutorials', {
      title: 'All Tutorials',
      user: req.user,
      post: tutorial,
      check: "false"
    });
  });
});

router.get('/viewTutorialCalculus', function(req, res) {
  post.find({guild: "Calculus Guild"}, function(err, tutorial) {
    console.log('Tutorials Loaded!');
    res.render('viewTutorials', {
      title: 'All Tutorials',
      user: req.user,
      post: tutorial,
      check: "false"
    });
  });
});

router.get('/viewTutorialDSP', function(req, res) {
  check = "false";
  post.find({guild: "DSP Guild"}, function(err, tutorial) {
    console.log('Tutorials Loaded!');
    res.render('viewTutorials', {
      title: 'All Tutorials',
      user: req.user,
      post: tutorial,
      check: "false"
    });
  });
});

router.get('/viewTutorial/:tutorialId', function(req, res) {    
    var tutorialId = req.params.tutorialId;  
    post.findOne({_id: tutorialId}, function(err, tutorial){
      comment.find({postId: tutorialId}, function(err, comments){
       Account.findOne({first_name: tutorial.first_name})
        res.render('tutorial', {
          title: tutorial.guild,
          post: tutorial,
          user: req.user,
          comment: comments
        });
      });
    }); 
});

router.get('/viewStudents/:receiver', function(req, res) {    
  var receiver = req.params.receiver;
  console.log(receiver)
  var sender = req.user.username;
  console.log(sender)
  Account.findOne({username: receiver}, function(err, student) {
    Account.findOne({username: sender}, function(err, users) {
      message.find({ $or:[
                        {sender: receiver, receiver: sender}, 
                        {sender: sender, receiver: receiver}
                      ]}, function(err, message) {
        console.log('Messages Loaded!');
        res.render('message', {
          title: 'Conversation',
          students: student,
          user: users,
          messages: message
        });
      });
    });
  });
});

router.post('/addTutorial', function(req, res)
 { 
    new post({        
        message: req.body.message,
        guild: req.user.guild,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        video: req.body.video,
        tutorialNo: req.body.number
  }).save(function(err, doc){
    if(err){
      console.log(err);
    } else {
      console.log('data added');
    }
  });
  res.redirect('/');
});

router.get('/viewTutorial/:tutorialId/updateTutorial', function(req, res) {  
    var tutorialId = req.params.tutorialId;
    post.findOne({_id: tutorialId}, function(err, tutorial){
      console.log(tutorial);
      res.render('updateTutorial', {
        title: tutorial.guild,
          user: req.user,
        post: tutorial
      });
    }); 
});

router.post('/viewTutorial/:tutorialId/updateTutorial', function(req, res) {  
    var tutorialId = req.params.tutorialId;
    var newData = {
        message: req.body.message,
        guild: req.user.guild,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        video: req.body.video
    }
    post.update({_id: tutorialId}, {$set: newData}, function(err, result) {
      if(err) {
        console.log("Speech not updated!");
      }
      else {
        console.log("Speech Updated!")
        res.redirect('/viewTutorial/' + tutorialId)
      }
    }); 
});

router.post('/viewTutorial/:tutorialId/comment', function(req, res) { 
    var tutorialId = req.params.tutorialId;
    new comment({        
        commentMes: req.body.comment,
        user: req.user.last_name,
        postId: tutorialId,
        username: req.user.username
  }).save(function(err, doc){
    if(err){
      console.log(err);
    } else {
      console.log('data added');
      console.log(comment)
    }
  });
  res.redirect('/viewTutorial/' + tutorialId);
});

router.post('/viewStudents/:studentName/sendMessage', function(req, res) {
  var studentName = req.params.studentName;
    new message({        
        mes: req.body.message,
        receiver: studentName,
        sender: req.user.username
  }).save(function(err, doc){
    if(err){
      console.log(err);
    } else {
      console.log('data added');
    }
  });
  res.redirect('/viewStudents/' + studentName);
});

router.get('/viewTutorial/:tutorialId/:commentsId/deleteComment', function(req, res) {
    var commentId = req.params.commentsId;
    var tutorialId = req.params.tutorialId;
    comment.findOneAndRemove({_id: commentId}, function(req, res){
    console.log('data deleted');
  });
  res.redirect('/viewTutorial/' + tutorialId)
});

router.get('/viewTutorial/:tutorialId/delete', function(req, res) {
    var tutorialId = req.params.tutorialId;
    post.findOneAndRemove({_id: tutorialId}, function(req, res){
    console.log('data deleted')
  });
  res.redirect('/')
});

router.get('/viewMessages', function(req, res) {
  var uname = req.user.username;
  Account.findOne({username: uname}, function(err, users) {
    message.find({receiver: uname}, function(err, recMessages) {
      message.find({sender: uname}, function(err, sentMessages) {
        console.log('Messages Loaded!');
        console.log(recMessages);
        console.log(sentMessages);
        res.render('viewMessages', {
          title: 'All Messages',
          user: users,
          mesReceive: recMessages,
          mesSent: sentMessages
        });
      });
    });
  });
});

router.get('/viewStudents/', function(req, res) {
  var uname = req.user.username;
  var userGuild = req.user.guild;
  Account.findOne({username: uname}, function(err, users) {
    Account.find({guild: userGuild}, function(err, student) {
        console.log('Students Loaded!');
        res.render('viewStudents', {
          title: 'Students',
          user: users,
          students: student
        });
    });
  });
});

router.get('/viewTutorial/:tutorialId/delete', function(req, res) {
    var tutorialId = req.params.tutorialId;
    post.findOneAndRemove({_id: tutorialId}, function(req, res){
    console.log('data deleted')
  });
  res.redirect('/')
});


module.exports = router;