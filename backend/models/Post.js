import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    mediaUrl: {
      type: String,
      default: '',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    hideTitle: {
      type: Boolean,
      default: false,
    },
    accessCode: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt access code using bcrypt
postSchema.pre('save', async function () {
  if (this.isPrivate && this.isModified('accessCode') && this.accessCode) {
    const salt = await bcrypt.genSalt(10);
    this.accessCode = await bcrypt.hash(this.accessCode, salt);
  }
});

// Compare access code
postSchema.methods.matchAccessCode = async function (enteredCode) {
  if (!this.accessCode) return false;
  return await bcrypt.compare(enteredCode, this.accessCode);
};

const Post = mongoose.model('Post', postSchema);

export default Post;
