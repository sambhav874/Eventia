// models/EventModel.ts

import mongoose, { Schema, model, models } from 'mongoose';

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  organiser: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPaid: { type: Boolean, required: true },
  capacity: { type: Number },
  price: { type: Number },
  duration: { type: Number },
  status: { type: String, default: 'listed' },
  tags: [String],
  rules: [String],
  terms_conditions: [String],
  images: [String],
  videos: [String],
  addedAt: { type: Date, default: Date.now },
  specialReqs: [String],
  isCancelled: { type: Boolean, default: false },
  faqQs: {
    type: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  lastRegisterationDate: {
    type: Date, required: true
  },
  entryProcedure: {
    type: String, required: false
  },
  eligibilityCriteria: {
    type: String, required: false
  },
  miniEvents: [{
    type: {
      title: String,
      description: String,
    }
    , required: false
  }],
  locationCoordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  certificates: {
    type: [String],
    required: false
  }
  ,
  prizes: {
    type: [
      {
        place: String,
        prize: String,
      },
    ]
    ,
    required: false
  }

});

const EventModel = models.Event || model('Event', EventSchema);

export default EventModel;