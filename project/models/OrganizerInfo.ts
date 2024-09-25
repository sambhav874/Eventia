import mongoose, { model, Schema, Model } from "mongoose";


const OrganizerSchema = new Schema<OrganizerInfo>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  website: { type: String, required: false },
  profileLogo: { type: String, required: false },
  linkedin: { type: String, required: false },
  instagram: { type: String, required: false },
  organizerType: { type: String, required: true },
  organizerRef: { type: Schema.Types.ObjectId, ref: 'User' },
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  bio: { type: String, required: false },
  founder: { type: String, required: false }
}, { timestamps: true });

const OrganizerInfo: Model<OrganizerInfo> = mongoose.models.OrganizerInfo || model<OrganizerInfo>('OrganizerInfo', OrganizerSchema);

export default OrganizerInfo;