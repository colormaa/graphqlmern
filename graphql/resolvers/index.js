const posts = require("./posts");
const users = require("./users");
const comments = require("./comments");
const resolvers = {
  Post: {
    likeCount(parent) {
      return parent.likes.length;
    },
    commentCount: (parent) => {
      return parent.comments.length;
    },
  },
  Query: {
    ...posts.Query,
  },
  Mutation: {
    ...users.Mutation,
    ...posts.Mutation,
    ...comments.Mutation,
  },
  Subscription: {
    ...posts.Subscription,
  },
};
module.exports = resolvers;
