var express = require('express');
var router = express.Router();
const appController = require("../controllers/app.controller");

const App = require("../models/Application");

function exists(req,res,next){
	App.findOne({name:req.body.name, email:req.body.email})
	.then(r=>res.send(r))
	.catch(e=>next());
}

router.get('/paginated', appController.paginated);

router.get('/all', appController.getAll);
router.post('/add', appController.findOrCreate);
router.get('/apps/:id', appController.detail);
//testing
router.get('/ten', appController.getTen);


//quering
router.post('/update', appController.updateGrades);


router.get('/search', appController.search);
router.get('/filter', appController.filter);

/*** 
 * RUTAS DE DAVID
 ***/

	router.get('/finalinterview', appController.finalCandidatesFiltered);
	router.patch('/finalinterview/:id', appController.editFinalist)

/*** 
 * RUTAS DE DAVID
 ***/


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
