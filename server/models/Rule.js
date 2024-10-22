import mongoose from 'mongoose';

const RuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  expression: {
    type: String,
    required: true,
  },
  ast: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Rule', RuleSchema);
