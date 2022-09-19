import { Schema, model } from 'mongoose'
import MongoosePaginate from 'mongoose-paginate-v2'

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

userSchema.plugin(MongoosePaginate)

const User = model('User', userSchema)

User.paginate()

export default User
