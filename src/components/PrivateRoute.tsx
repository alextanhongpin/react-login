import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "hooks/useAuth";

interface PrivateRouteProps {
  children: React.ReactElement;
  [x: string]: unknown;
}

export function PrivateRoute({
  children,
  ...rest
}: PrivateRouteProps): React.ReactElement {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth?.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location.pathname }
            }}
          />
        )
      }
    />
  );
}
