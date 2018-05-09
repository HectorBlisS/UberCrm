const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const mongooseToCsv = require('mongoose-to-csv');



const appSchema = new Schema({
	name:{
		type:String,
		required:false
	},
	surName: String,
	lastName: String,
	email: String,
	tel: String,
	cp: String,
	kindOfUser: String,
	grade: String,
	adult: String,
	understanding: String,
	course: String,
	why: String,
	objectives: String,
	skills: String,
	date: String,
	token: String,
	score: String,
	evaluator: String,
	scoreN: String,
	comment: String,
	interview_score: Number,
	interviewer_comment: String,
	webScore:String,
	uxScore:String,
	technicalCategory:String,
	whyTo:String,
	personal_interviewer: String

});

appSchema.plugin(mongooseToCsv, {
	headers: 'Name SurName LastName Email Tel CP KindOfUser Grade Adult Course Why objectives skills date Token Score Evaluator ScoreN Comment InterviewScore InterviewerComment WebScore UxScore TechnicalCategory WhyTo PersonalInterviewer Understanding',
	constraints: {
	  'Name':'name',
	  'SurName': 'surName',
	  'LastName': 'lastName',
	  'Email': 'email',
	  'Tel':'tel',
	  'CP':'cp',
	  'KindOfUser':'kindOfUser',
	  'Grade':'grade',
	  'Adult':'adult',
	  'Course': 'course',
	  'Why':'why',
	  'objectives':'objectives',
	  'skills':'skills',
	  'date':'date',
	  'Token':'token',
	  'Score':'score',
	  'Evaluator':'evaluator',
	  'ScoreN':'scoreN',
	  'Comment':'comment',
	  'InterviewScore':'interview_score',
	  'InterviewerComment':'interviewer_comment',
	  'WebScore':'webScore',
	  'UxScore':'uxScore',
	  'TechnicalCategory':'technicalCategory',
	  'WhyTo':'whyTo',
	  'PersonalInterviewer':'personal_interviewer',
	  'Understanding':'understanding'
	}
	// virtuals: {
	//   'BlisS': function(doc) {
	// 	return doc.enrolled[0];
	//   }
	//   'Lastname': function(doc) {
	// 	return doc.fullname.split(' ')[1];
	//   }
	// }
  });
  appSchema.plugin(mongoosePaginate);


module.exports = mongoose.model("App", appSchema);