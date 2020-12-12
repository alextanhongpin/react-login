import React, { useEffect } from "react";
import "./App.css";

import { Switch, Route, Link } from "react-router-dom";
import { useAuth } from "hooks/useAuth";

function LoginPage() {
  const auth = useAuth();

  const handleLogin = () =>
    auth.login({
      email: "john.doe@mail.com",
      password: "12345678"
    });

  return (
    <div>
      <h1>Login </h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

function ProfilePage() {
  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
}

function App() {
  const { user, logout, authorize } = useAuth();
  useEffect(() => {
    const accessToken = window.localStorage.getItem("accessToken");
    if (accessToken) authorize({ accessToken });
  }, []);

  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}
      <Link to="/profile">Profile</Link>

      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/profile">
          <ProfilePage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
