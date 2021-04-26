import React, { useContext } from "react";
import { Card, Button, Icon, Image, Label } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
const PostCard = (props) => {
  const {
    body,
    createdAt,
    id,
    username,
    likeCount,
    commentCount,
    likes,
  } = props.post;
  const { user } = useContext(AuthContext);

  return (
    <Card>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />

        <Button labelPosition="right" as={Link} to={`/post/${id}`}>
          <Button color="blue" basic>
            <Icon name="comments" />
          </Button>
          <Label color="blue" basic pointing="left">
            {commentCount}
          </Label>
        </Button>
        {user && user.username == username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};
export default PostCard;
