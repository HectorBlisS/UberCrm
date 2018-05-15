const router = require('express').Router();
const Course = require('../models/Course');
const User = require('../models/User');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const App = require('../models/Application');
const inscrito = require('../helpers/mailer').inscrito;
var csv = require('csv-express')



function isAdmin(req,res, next){
    if(!req.isAuthenticated()) return res.redirect('/auth/login');
    if(req.user.role !== "ADMIN") return res.redirect('/auth/profile');
    return next();
}

router.post('/apps/download', isAdmin, (req,res, next)=>{
    const query = JSON.parse(req.body.query);
    var filename   = "products.csv";
    //var dataArray;
    App.find(query).lean()
    .then(apps=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename='+filename);
        res.csv(apps, true);

    })
    .catch(e=>next(e))
    // App.find(query)
    // // .populate('app')
    // .then(docs=>{
    //     App.csvReadStream(docs)
    //     .pipe(fs.createWriteStream(path.join(__dirname, '../public', 'bliss.csv')))
    //     .on('finish', function () {
    //         res.sendFile(path.join(__dirname, '../public', 'bliss.csv'));
    //       });
    // })

})

router.post('/apps', isAdmin, (req,res, next)=>{
    const query = {};
    if(req.body.personal_interviewer) query['personal_interviewer'] = req.body.personal_interviewer;
    if(req.body.interview_score) query['interview_score'] = req.body.interview_score;
    if(req.body.webScore) query['webScore'] = {$gte:req.body.webScore};

    //pages
    const options = {};
    if(req.query.page && req.query.page <= req.query.pages && req.query.page > 0){
        options["page"] = Number(req.query.page);
    }
    delete req.query.page;
    delete req.query.pages;
    //query['interview_score'] = {$exists:true};

    let theQuery = JSON.stringify(query);
    App.paginate(query, options)
    .then(result=>{
        res.render('admin/apps', {apps:result.docs,result,theQuery});
    })
    .catch(e=>next(e))
});

router.get('/apps', (req,res,next)=>{
    const options = {};
    if(req.query.page && req.query.page <= req.query.pages && req.query.page > 0){
        options["page"] = Number(req.query.page);
    }
    delete req.query.page;
    delete req.query.pages;
    const {query} = req;    
    query['interview_score'] = {$exists:true};
    let theQuery = JSON.stringify(query);
    App.paginate(query, options)
    .then(result=>{
        console.log(result)
        res.render('admin/apps', {apps:result.docs,result,theQuery});
    })
    .catch(e=>next(e))
});


// User.find({}).exec()
//   .then(function(docs) {
//     User.csvReadStream(docs)
//       .pipe(fs.createWriteStream('users.csv'));
//   });


//testing export **  Pinche hermoso **
router.get('/users/export', isAdmin, (req,res,next)=>{
    let query = { role: { $not: { $eq: "ADMIN" } } };
    User.find(query)
        .populate('app')
        .then(docs=>{
            User.csvReadStream(docs)
            .pipe(fs.createWriteStream(path.join(__dirname, '../public', 'bliss.csv')))
            .on('finish', function () {
                res.sendFile(path.join(__dirname, '../public', 'bliss.csv'));
              });
        })
        
});

router.get('/users/:id', isAdmin, (req,res, next)=>{
    let promise;
    if(req.query.accepted) {
        promise = User.findByIdAndUpdate(req.params.id, {status:"ACCEPTED"});
    } else{
        promise = User.findById(req.params.id);
    }

    
    promise
    .populate('app')
    .populate('selectedCourse')
    .then(user=>{
        const hayLugar = user.selectedCourse.enrolled.length <= user.selectedCourse.totalPlaces;

        if(req.query.accepted){
            inscrito(user.email, "Estas inscrito!", "estas inscrito", user.app.name); //envio felicitacion
        }
//        console.log(user);
        res.render('admin/userDetail', {user, hayLugar});
    })
    .catch(e=>next(e));
});

router.post('/users/:id', isAdmin, (req,res, next)=>{
    if(req.body.eliminar){
        User.findByIdAndUpdate(req.params.id,  {$unset: { selectedCourse: 1, status:1 }})
        .then(user=>{
            res.redirect('/admin/users/');
        })
        .catch(e=>next(e))
    }else{
        res.redirect('/admin/users/');
    }
    
})

router.post('/users', isAdmin, (req,res,next)=>{
    const field = req.body.search;
    query = {$or:[
           {username:{$regex: field, $options: 'i'}},
           {email:{$regex: field, $options: 'i'}},
            // {"app.name":{$regex:field, $options: 'i'}},
            // {"app.surName":{$regex:field, $options: 'i'}},
            // {"app.email":{$regex:field, $options: 'i'}}
        ]
    };
    User.find(query)
    .populate('app')
    .then(users=>{
        console.log(users)
        res.render('admin/users', {users});
    })
    .catch(e=>next(e))
})

router.get('/users', isAdmin, (req,res,next)=>{
    const options = {};
    let query = { role: { $not: { $eq: "ADMIN" } } };
    if(req.query.page && req.query.page <= req.query.pages && req.query.page > 0){
		options["page"] = Number(req.query.page);
		delete req.query.page;
	}
    options["limit"] = Number(10);
    options['populate'] = ['app', 'selectedCourse'];
    //User.paginate(query,options)
    User.find(query).populate('app').populate('selectedCourse')
    .then(result=>{
        Promise.all([User.find(query).count(), User.find({selectedCourse:{$exists:true}}).count(), User.find({status:'SENT'}).count()])
        .then(results=>{
            res.render('admin/users', {users:result, total:results[0], choosen:results[1], paid:results[2]})
        })
        //res.render('admin/users', {users:result.docs,result});
        
    })
    .catch(e=>next(e));
});


router.get('/courses/:id', isAdmin, (req,res,next)=>{
    Course.findById(req.params.id)
    .populate({
        path: 'enrolled',
        model: 'User',
        populate: {
          path: 'app',
          model: 'App'
        }})
    .then(course=>{
        console.log("chet",course.enrolled.length)
        course.fecha = moment(course.date).format('YYYY-MM-DD'); 
        course.endFecha = moment(course.endDate).format('YYYY-MM-DD');
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
    let total;
    Course.find().count()
    .then(count=>{
        total=count;
        return Course.find()
    })
    
    .then(courses=>{
        res.render('admin/courses', {courses, total})
    })
    .catch(e=>next(e));
});

router.get("/", isAdmin, (req,res)=>{
    res.redirect("admin/users");
})


router.get('/brendi', (req,res)=>{
    res.render('mail/payUploaded');
})


module.exports = router;