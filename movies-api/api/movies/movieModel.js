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
        // Only validate the plain-text password before hashing
        if (this.isModified('password')) {
          return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(v);
        }
        return true; // If password is not modified, skip validation
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
      addedAt: { type: Date, default: Date.now }
    }
  ],
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
      // Validate the password before hashing
      if (this.isModified('password')) {
        const valid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(this.password);
        if (!valid) {
          throw new Error("Password must contain at least 8 characters, including one letter, one number, and one special character.");
        }
      }
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
