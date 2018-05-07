const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseToCsv = require('mongoose-to-csv');

const courseSchema = new Schema({
	active:{
		type:Boolean,
		default:true
	},
	date:{
		type:Date,
		required:true
	},
	endDate:{
		type:Date,
		required:false
	},
	kind:{
		type:String,
		enum:["Web Dev", "UX/UI"],
		default:"Web Dev"
	},
	type:{
		type:String,
		enum:["Full-time", "Part-time"],
		default:"Full-time"
	},
	desc:String,
	publisher:{
		type:Schema.Types.ObjectId,
		ref:"User"
	},
	enrolled:[{
		type:Schema.Types.ObjectId,
		ref:"User"
	}],
	totalPlaces:{
		type:Number,
		default:17
	}
	

},
{
    timestamps:{
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

//virtuals
courseSchema.virtual('totalEnrolled').get(function() {  
    return this.enrolled.length;
});
courseSchema.virtual('available').get(function() {  
    return this.enrolled.length < this.totalPlaces;
});

courseSchema.plugin(mongooseToCsv, {
	headers: 'Kind Type Lugares Date Publisher Enrolled Active Desc',
	constraints: {
	  'Lugares':'totalPlaces',
	  'Kind': 'kind',
	  'Type': 'type',
	  'Date': 'date',
	  'Publisher':'publisher',
	  'Enrolled':'enrolled',
	  'Active':'active',
	  'Desc':'desc'
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


module.exports = mongoose.model("Course", courseSchema);