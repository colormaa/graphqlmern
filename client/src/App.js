import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import { AuthProvider } from "./context/auth";
import MenuBar from "./components/MenuBar";
import Home from "./Pages/home";
import Login from "./Pages/login";
import Register from "./Pages/register";
import SinglePost from "./Pages/SinglePost";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import AuthRoute from "./util/AuthRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />

          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route path="/post/:postId" component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
