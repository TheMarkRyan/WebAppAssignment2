import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Only validate the password if it hasn't been hashed yet
        return this.isModified('password')
          ? /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(v)
          : true;
      },
      message: props => 'Password must contain at least 8 characters, including one letter, one number, and one special character.',
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

UserSchema.methods.comparePassword = async function (password) { 
  return await bcrypt.compare(password, this.password); 
};

UserSchema.statics.findByUserName = function (username) {
  return this.findOne({ username: username });
};

// Pre-save hook to hash the password before saving it
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
