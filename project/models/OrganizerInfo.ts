import mongoose ,{model , Schema , models, Model}  from "mongoose";

const Organizer = new Schema<OrganizerInfo>({

    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    username : {type : String , required: true},
    phoneNumber: {type: String , required : true},
    website : {
        type : String,
        required : false
    },
    profileLogo : {
        type : String,
        required : false
    }
    ,
    linkedin: {
        type : String,
        required : false
    }
    ,
    instagram : {
        type : String,
        required : false
    },
    organizerType: {
        type: String,
        required: true
    } ,
    organizerRef : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
} , {timestamps: true})

const OrganizerInfo = (mongoose.models.OrganizerInfo as Model<OrganizerInfo>) || model<OrganizerInfo>('OrganizerInfo', Organizer);


export default OrganizerInfo;