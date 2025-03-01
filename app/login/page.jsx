"use client";
import { useState, useEffect } from "react";
import { account } from "@/lib/appwrite";
import Link from "next/link";
import "@/styles/login.css";

const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const user = await account.get();
        setLoggedInUser(user);
      } catch (err) {
        setLoggedInUser(null);
      }
    };
    checkLoggedInUser();
  }, []);

  const login = async () => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setLoggedInUser(user);
      setError("");
      window.location.href = "/"; // Reloads the home page after login
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setLoggedInUser(null);
      window.location.href = "/"; // Reloads the home page after logout
    } catch (err) {
      setError("Failed to log out. Please try again.");
      console.error(err);
    }
  };

  if (loggedInUser) {
    return (
      <div className="container">
        <div className="form-container">
          <p>Logged in as {loggedInUser.name}</p>
          <button type="button" onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <p>Login</p>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button type="button" onClick={login}>Login</button>
        <p>Don't have an account? <Link href="/signup">Register here</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
