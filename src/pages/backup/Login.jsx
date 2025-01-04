// src/Login.js
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import API from "../services/api";
import './style/Login.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/users/login", { username, password });
      localStorage.setItem("token", data.token);
      history.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="card card-custom">
        <div className="card-body">
          <h1 className="text-center mb-4">LYMONER GESTION</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-block">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
