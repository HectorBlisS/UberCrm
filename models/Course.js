const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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


module.exports = mongoose.model("Course", courseSchema);