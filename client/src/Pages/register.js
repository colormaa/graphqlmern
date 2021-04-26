import React, { useContext, useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";
import { REGISTER_USER } from "../util/graphql";
const Register = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(__, result) {
      context.login(result.data.register);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });
  function registerUser() {
    addUser();
  }

  return (
    <div className="formContainer">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
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
          label="Email"
          type="email"
          placeholder="Email..."
          name="email"
          value={values.email}
          onChange={onChange}
          error={errors.email ? true : false}
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

        <Form.Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword ? true : false}
        />
        <Button type="submit" primary>
          Register
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

export default Register;
