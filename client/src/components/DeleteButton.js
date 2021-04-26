import React, { useState } from "react";
import { Button, Confirm, Popup, Label, Icon } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopups";
const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        //todo delete post from cache
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        data.getPosts = data.getPosts.filter((p) => p.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      } else {
      }
      if (callback) {
        callback();
      }
    },
    variables: {
      postId,
      commentId,
    },
  });
  return (
    <>
      <MyPopup content={commentId ? "Delete Comment" : "Delete post"}>
        <Button
          as="div"
          color="red"
          onClick={() => {
            setConfirmOpen(true);
          }}
        >
          <Icon name="trash" />
        </Button>
      </MyPopup>

      <Confirm
        open={confirmOpen}
        onConfirm={() => {
          deletePostOrMutation();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};
const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
export default DeleteButton;
