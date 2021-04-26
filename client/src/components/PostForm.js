import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useForm } from "../util/hooks";
import { gql, useMutation } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../util/graphql";
const PostForm = () => {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });
  //const [error, setError] = useState({});
  function createPostCallback() {
    console.log("create post callback");
    createPost();
  }
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    onError(err) {
      //console.log("error ", err);
      //setError(err);
    },
    update(proxy, result) {
      console.log("result create post ", result);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      console.log("resutl data reqd query ", data.getPosts);
      const dat = {};
      dat.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: dat });
      values.body = "";
    },
  });
  console.log("err ", error && error.graphQLErrors[0]);
  return (
    <>
      <Form noValidate onSubmit={onSubmit}>
        <Form.Field>
          <Form.Input
            placeholder="Hi world !"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};
const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
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
export default PostForm;
