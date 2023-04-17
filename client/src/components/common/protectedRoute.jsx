import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";

const ProtectedRoute = ({ path, component: Component, render, ...rest }) => {
  const cookies = new Cookies();
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!cookies.get("token"))
          return (
            <Redirect
              to={{ pathname: "/users/login", state: { from: props.location } }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedRoute;
