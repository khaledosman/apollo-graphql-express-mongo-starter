import Mongoose from 'mongoose'

const ViewSchema = Mongoose.Schema({
  postId: { type: Mongoose.Schema.Types.ObjectId, ref: 'Post' },
  views: Number
})

const View = Mongoose.model('View', ViewSchema)

export { View }
