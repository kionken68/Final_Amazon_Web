var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User =require('../models/user');


passport.serializeUser(function(user,done){
  done(null,user._id);
});

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user);
  });
});

passport.use('local-login', new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
  passReqToCallback:true},
  function(req,email,password,done){
    User.findOne({email:email},function(err,user){
      if(err) return done(err);

      if(!user){
        return done(null,false,req.flash('loginMessage','No user has been found'));
      }
      if(!user.comparePassword(password)){
        return done(null,false,req.flash('loginMessage','Opps! Wrong Password pal'));
      }
      return done(null,user)
    });
}));

exports.isAuthemtacated=function(req,res,next){
  if(req.isAuthemtacated()){
    return next();
  }
  res.redirect('/login');
}
