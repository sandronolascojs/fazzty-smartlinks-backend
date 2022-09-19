import { Schema, model } from 'mongoose'
import MongoosePaginate from 'mongoose-paginate-v2'

const linkSchema = new Schema({
  artists: {
    type: [String],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  previewUrl: Object,
  links: Object,
  customLinks: [{
    name: String,
    url: String,
    customIcon: String
  }],
  images: Object,
  releaseDate: String,
  explicit: Boolean,
  user: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  publicUrl: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: true
  },
  visits: [{
    type: Date
  }]
}, {
  timestamps: true,
  versionKey: false
})

linkSchema.plugin(MongoosePaginate)

const Link = model('Link', linkSchema)

Link.paginate()

export default Link
