import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(v);
      },
      message: props => `${props.value} is not a valid password! It must contain at least 8 characters, including one letter, one number, and one special character.`,
    },
  },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' },
});

UserSchema.methods.comparePassword = async function (passw) { 
  return await bcrypt.compare(passw, this.password); 
};

UserSchema.statics.findByUserName = function (username) {
  return this.findOne({ username: username });
};

UserSchema.pre('save', async function(next) {
  const saltRounds = 10;
  if (this.isModified('password') || this.isNew) {
    try {
      const hash = await bcrypt.hash(this.password, saltRounds);
      this.password = hash;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export default mongoose.model('User', UserSchema);
