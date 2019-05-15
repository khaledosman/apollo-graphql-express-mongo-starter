import { PubSub } from 'apollo-server-express'
import { Author } from '../model/author'
import { View } from '../model/view'
import { Post } from '../model/post'
import { FortuneCookie } from '../model/fortune-cookie'

const pubsub = new PubSub()

const resolvers = {
  Query: {
    author (parent, args) {
      return Author.find({ firstName: args.firstName, lastName: args.lastName }).then(results => Promise.resolve(results[0]))
    },
    allAuthors (parent, args) {
      return Author.find({})
    },
    getFortuneCookie (parent, args, _, info) {
      // info.cacheControl.setCacheHint({ maxAge: 60, scope: 'PRIVATE' })
      return FortuneCookie.getOne()
    }
  },
  Mutation: {
    createPost (parent, { input }) {
      return new Post(input).save().then((post) => {
        pubsub.publish('postAdded', { postAdded: post })
        return Promise.resolve(post)
      })
    }
  },
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator(['postAdded'])
    }
  },
  Author: {
    posts (author) {
      return Post.find({ author: author })
    },
    id (author) {
      return author.id
    }
  },
  Post: {
    author (post) {
      return Author.findById(post.author)
    },
    views (post) {
      return View.findOne({ postId: post.id }).then(view => view.views)
    }
  }
}

export default resolvers
