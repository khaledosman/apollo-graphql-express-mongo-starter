import Mongoose from 'mongoose'
import casual from 'casual'
import _ from 'lodash'
import { Author } from './model/author'
import { Post } from './model/post'
import { View } from './model/view'

Mongoose.Promise = global.Promise

// const mongo = Mongoose.connect(`mongodb://test:123@graphql-poc-shard-00-00-trxb2.mongodb.net:27017,graphql-poc-shard-00-01-trxb2.mongodb.net:27017,graphql-poc-shard-00-02-trxb2.mongodb.net:27017/test?ssl=true&replicaSet=GraphQL-POC-shard-0&authSource=admin`, { })
const mongo = Mongoose.connect(`mongodb+srv://khaled:123@cluster0-lh6y2.mongodb.net/test?retryWrites=true`, {
  useNewUrlParser: true
})
const db = Mongoose.connection
casual.seed(123)
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('connected to mongo successfully')

  Author.deleteMany({}, err => {
    err && console.error(err)
    console.log('Authors removed')
  })

  Post.deleteMany({}, err => {
    err && console.error(err)
    console.log('Posts removed')
  })

  View.deleteMany({}, err => {
    err && console.error(err)
    console.log('Views removed')
  })

  _.times(10, () => {
    return new Author({
      firstName: casual.first_name,
      lastName: casual.last_name
    }).save().then((author) => {
      return new Post({
        title: `A post by ${author.firstName}`,
        text: casual.sentences(3),
        author: author._id
      }).save()
    })
      .then(post => {
        // create some View mocks
        return View.updateMany(
          { postId: post._id },
          { views: casual.integer(0, 100) },
          { upsert: true })
      }).catch(e => {
        console.log('ERROR: ', e)
      })
  })
})

export { db }
