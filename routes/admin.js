const router = require('express').Router();
const Course = require('../models/Course');
const User = require('../models/User');
const moment = require('moment');

function isAdmin(req,res, next){
    if(!req.isAuthenticated()) return res.redirect('/auth/login');
    if(req.user.role !== "ADMIN") return res.redirect('/auth/profile');
    return next();
}

router.get('/users/:id', isAdmin, (req,res, next)=>{
    User.findById(req.params.id)
    .populate('app')
    .populate('selectedCourse')
    .then(user=>{
        res.render('admin/userDetail', {user});
    })
    .catch(e=>next(e));
})

router.get('/users', isAdmin, (req,res,next)=>{
    User.find({ role: { $not: { $eq: "ADMIN" } } } )
    .populate('selectedCourse')
    .populate('app')
    .then(users=>{
        res.render('admin/users', {users});
    })
    .catch(e=>next(e));
});


router.get('/courses/:id', isAdmin, (req,res,next)=>{
    Course.findById(req.params.id)
    .then(course=>{
        course.fecha = moment(course.date).format('YYYY-MM-DD'); 
        res.render('admin/courseDetail', {course});
    })
    .catch(e=>next(e));
})

router.post('/courses/:id', isAdmin, (req,res, next)=>{
    if(req.body.active) req.body.active = true;
    else req.body.active = false;
    Course.findByIdAndUpdate(req.params.id, req.body)
    .then(course=>{
        res.redirect('/admin/courses');
    })
    .catch(e=>next(e));
})

router.post('/courses', isAdmin, (req,res, next)=>{
    req.body.publisher = req.user._id;
    Course.create(req.body)
    .then(course=>{
        res.redirect('/admin/courses');
    })
    .catch(e=>next(e));
})

router.get('/courses', isAdmin, (req,res,next)=>{
    Course.find()
    .then(courses=>{
        res.render('admin/courses', {courses})
    })
    .catch(e=>next(e));
});

router.get("/", isAdmin, (req,res)=>{
    res.redirect("admin/users");
})



module.exports = router;