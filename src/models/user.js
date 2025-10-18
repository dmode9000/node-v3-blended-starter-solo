import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// middleware to set userName before saving
userSchema.pre('save', function (next) {
  if (this.name) this.userName = this.email;

  next();
});

// method to hide password field when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// create text index on email field for efficient searching
userSchema.index({ email: 'text' });

export const User = model('User', userSchema);
