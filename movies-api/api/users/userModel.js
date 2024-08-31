import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Skip validation if password is already hashed
        return v.startsWith('$2b$') || /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(v);
      },
      message: props => `${props.value} is not a valid password! It must contain at least 8 characters, including one letter, one number, and one special character.`,
    },
  },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  favoriteMovies: [{ type: String }], // Array to store favorite movie IDs or titles
  watchlist: [
    {
      id: { type: String },
      title: { type: String },
      addedAt: { type: Date, default: Date.now },
    },
  ],
});

// Password hashing middleware
UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(user.password, saltRounds);
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (passw) { 
  return await bcrypt.compare(passw, this.password); 
};

UserSchema.statics.findByUserName = function (username) {
  return this.findOne({ username: username });
};

export default mongoose.model('User', UserSchema);
