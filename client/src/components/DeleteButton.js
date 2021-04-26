import React, { useState } from "react";
import { Button, Confirm, Label, Icon } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
const DeleteButton = ({ postId }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update() {
      setConfirmOpen(false);
      //todo delete post from cache
    },
    variables: {
      postId,
    },
  });
  return (
    <>
      <Button
        as="div"
        color="red"
        onClick={() => {
          setConfirmOpen(true);
        }}
      >
        <Icon name="trash" />
      </Button>
      <Confirm
        open={confirmOpen}
        onConfirm={() => {
          deletePost();
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
export default DeleteButton;
