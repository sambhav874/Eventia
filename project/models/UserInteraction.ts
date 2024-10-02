import mongoose, { Schema, Document } from 'mongoose';


const UserTagInteractionSchema: Schema = new Schema({
  userEmail: { type: String, required: true, unique: true },
  tagCounts: { type: Map, of: Number, default: {} },
  lastUpdated: { type: Date, default: Date.now }
});

const UserTagInteraction = mongoose.models.UserTagInteraction || mongoose.model<UserTagInteraction>('UserTagInteraction', UserTagInteractionSchema);

export default UserTagInteraction;