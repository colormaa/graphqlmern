const { AuthenticationError, UserInputError } = require("apollo-server-errors");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
module.exports = {
  Query: {
    async getPosts() {
      try {
        var posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (e) {
        throw new Error(e);
      }
    },
    async getPost(_, { postId }) {
      console.log("get post ", postId);
      try {
        var post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Mutation: {
    //body:String
    async createPost(_, { body }, context) {
      if (body.trim() == "") {
        throw new UserInputError("text is empty", {
          errors: {
            body: "text is empty",
          },
        });
      }
      try {
        const user = checkAuth(context);
        const newPost = new Post({
          user: user.id,
          username: user.username,
          body,
          createdAt: new Date().toISOString(),
        });
        const post = await newPost.save();
        context.pubsub.publish("NEW_POST", {
          newPost: post,
        });
        return post;
      } catch (e) {
        throw new Error(e);
      }
    },
    //postId: id
    async deletePost(_, { postId }, context) {
      try {
        const user = checkAuth(context);
        const post = await Post.findById(postId.toString());
        if (!post) {
          throw new Error("Post not found");
        }
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    async likePost(_, { postId }, context) {
      try {
        const { username } = checkAuth(context);
        const post = await Post.findById(postId.toString());
        if (!post) {
          throw new UserInputError("Post not found");
        }
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
