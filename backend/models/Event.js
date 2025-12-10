import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  primaryColor: {
    type: String,
    default: '#0001'
  },
  secondaryColor: {
    type: String,
    default: '#1111'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
