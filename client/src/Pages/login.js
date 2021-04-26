import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";
import { LOGIN_USER } from "../util/graphql";
const Login = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(__, result) {
      context.login(result.data.login);
      props.history.push("/");
    },
    onError(err) {
      console.log("err  ", err);
      //setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });
  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="formContainer">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          type="text"
          placeholder="Username..."
          name="username"
          value={values.username}
          onChange={onChange}
          error={errors.username ? true : false}
        />

        <Form.Input
          label="Password"
          type="password"
          placeholder="Password..."
          name="password"
          value={values.password}
          onChange={onChange}
          error={errors.password ? true : false}
        />

        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => {
              return <li key={value}>{value}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Login;
