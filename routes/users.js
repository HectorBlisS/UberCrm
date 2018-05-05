var express = require('express');
var router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const uploads = require('multer')({dest: './public/uploads'});

function isAuth(req,res,next){
  if(!req.isAuthenticated()) return res.redirect('/auth/login?next=/select');
  return next();
}

router.post('/reserva', uploads.single('file'), (req,res,next)=>{
  if(!req.file) return res.redirect('/auth/profile');
  req.user.paymentPic = '/uploads/' + req.file.filename;
  req.user.status = "SENT";
  User.findByIdAndUpdate(req.user._id,req.user)
  .then(user=>res.redirect('/auth/profile'))
  .catch(e=>next(e));
});

router.post('/select', isAuth, (req,res, next)=>{
  req.user.selectedCourse = req.body.courseId;
  User.findByIdAndUpdate(req.user._id, req.user)
  .then(user=>{
    res.redirect('/auth/profile');
  })
  .catch(e=>next(e))
})

/* courses for users to choose listing. */
router.get('/select', isAuth, function(req, res, next) {
  if(req.user.selectedCourse) return res.redirect('/auth/profile');
  Course.find()
  .then(courses=>{
    res.render('list', {courses});
  })
  .catch(e=>next(e));
});

module.exports = router;
