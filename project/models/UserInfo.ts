import mongoose ,{model , Schema , models, Model}  from "mongoose";

const UserInfoSchema = new Schema<UserInfo>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    website: String,
    linkedin: String,
    instagram: String,
    profilePicture: String,
    gender: String,
    address: String,
    dob: Date,
    userRef: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }, { timestamps: true });
  
  // Use this pattern to prevent model recompilation
  const UserInfo: Model<UserInfo> = mongoose.models.UserInfo || model<UserInfo>('UserInfo', UserInfoSchema);
  
  export default UserInfo;