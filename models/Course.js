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
	kind:{
		type:String,
		enum:["Web Development", "UX/UI"],
		default:"Web Development"
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
	}]
	

},
{
    timestamps:{
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

courseSchema.plugin(mongooseToCsv, {
	headers: 'Kind Type Date Publisher Enrolled Active Desc',
	constraints: {
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