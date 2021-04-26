import React, { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { Grid, Button, Icon, Label, Card, Image } from "semantic-ui-react";
import LikeButton from "../components/LikeButton";
import moment from "moment";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
const SinglePost = (props) => {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });
  console.log("Data get post single ", postId);
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
                {user && user.username == username && (
                  <DeleteButton postId={id} />
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
};
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
