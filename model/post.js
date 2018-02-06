import Mongoose from 'mongoose'

const PostSchema = {
  title: String,
  text: String,
  author: { type: Mongoose.Schema.Types.ObjectId, ref: 'Author' }
}
const Post = Mongoose.model('Post', PostSchema)

export { Post }
