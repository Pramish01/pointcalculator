import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  playerId: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: ''
  }
});

const teamSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  logoUrl: {
    type: String,
    default: ''
  },
  players: [playerSchema],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
