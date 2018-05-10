const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoose = require('passport-local-mongoose');
const mongoosePaginate = require('mongoose-paginate');
const mongooseToCsv = require('mongoose-to-csv');


const userSchema = new Schema({

    active:{
        type:Boolean,
        default:true
    },
	username:{
		type:String,
		required:true
	},
	app: {
        type:Schema.Types.ObjectId,
        ref:"App"
    },
    email:{
        type:String,
        required:true
    },
    photoURL:String,
    role:{
        type:String,
        enum:["ADMIN", "GUEST", "STUDENT"],
        default:"GUEST"
    },
    selectedCourse:{
        type:Schema.Types.ObjectId,
        ref:"Course"
    },
    paymentPic:String,
    status:{
        type:String,
        enum:["PENDING", "SENT", "ACCEPTED"],
        default:"PENDING"
    }

},{
    timestamps:{
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

userSchema.plugin(mongoosePaginate);
userSchema.plugin(PassportLocalMongoose, {usernameField:"email"});
userSchema.plugin(mongooseToCsv, {
	headers: 'FullName Email PhotoURL Course Payment Status AppId Active',
	constraints: {
	  'Email': 'email',
	  'PhotoURL': 'photoURL',
	  'Course': 'selectedCourse',
	  'Payment':'paymentPic',
	  'Status':'status',
	  'Active':'active'
	},
	virtuals: {
	  'FullName': function(doc) {
		return doc.app.name + " " + doc.app.surName;
	  },
	  'AppId': function(doc) {
		return doc.app._id
	  }
	}
  });

module.exports = mongoose.model("User", userSchema);