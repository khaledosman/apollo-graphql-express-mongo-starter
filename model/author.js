import Mongoose from 'mongoose'

const AuthorSchema = {
  firstName: String,
  lastName: String,
  posts: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}
const Author = Mongoose.model('Author', AuthorSchema)

export { Author }
