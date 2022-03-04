
import React from "react";
import { useCookies } from "react-cookie";
import { Route, Navigate } from "react-router-dom";


// receives component and any other props represented by ...rest
export default function ProtectedRoutes({ component: Component, ...rest }) {
  const [cookies, setCookies, removeCookies] = useCookies(['user'])
  return (

    // this route takes other route assigned to it from the App.js and return the same route if condition is met
    <Route
      {...rest}
      render={(props) => {
        // get cookie from browser if logged in
        const token = cookies.AuthToken;

        // return route if there is a valid token set in the cookie
        if (token) {
          return <Component {...props} />;
        } else {
          // return the user to the landing page if there is no valid token set
          return (
            <Navigate
              to={{
                pathname: "/",
                state: {
                  // sets the location a user was about to assess before being redirected to login
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
}
