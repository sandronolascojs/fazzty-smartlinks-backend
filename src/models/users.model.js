import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  hashPassword: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  links: [{
    type: Schema.Types.ObjectId,
    ref: 'Link'
  }],
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
})

const User = model('User', userSchema)

export default User
