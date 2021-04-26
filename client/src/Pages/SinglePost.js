import React, { useContext, useRef, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Grid, Button, Icon, Label, Card, Image } from "semantic-ui-react";
import LikeButton from "../components/LikeButton";
import moment from "moment";
import { AuthContext } from "../context/auth";
import MyPopup from "../util/MyPopups";
import DeleteButton from "../components/DeleteButton";
const SinglePost = (props) => {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const inputCommentRef = useRef(null);
  const [comment, setComment] = useState("");
  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      inputCommentRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });
  const deletePostCallback = () => {
    props.history.push("/");
  };
  const commentClicked = () => {};
  let postMarkup;
  if (!data?.getPost) {
    postMarkup = <div>loading...</div>;
  } else {
    console.log("");
    const {
      id,
      body,
      createdAt,
      username,
      likeCount,
      likes,
      commentCount,
      comments,
    } = data?.getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src={
                "https://react.semantic-ui.com/images/avatar/large/molly.png"
              }
              size={"small"}
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <MyPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => commentClicked()}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>

                {user && user.username == username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment ... "
                        name="comment"
                        value={comment}
                        ref={inputCommentRef}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => {
              return (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username == comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              );
            })}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};
const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;
const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        id
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
export default SinglePost;
