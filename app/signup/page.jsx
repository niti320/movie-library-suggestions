"use client";
import { useState, useEffect } from "react";
import { account, ID } from "@/lib/appwrite";
import Link from "next/link";
import "@/styles/login.css";

const LoginPage = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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

  const register = async () => {
    try {
      await account.create(ID.unique(), email, password, name);
      login(email, password);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    }
  };

  if (loggedInUser) {
    return (
      <div className="container">
        <div className="form-container">
          <p>Logged in as {loggedInUser.name}</p>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="container">
        <div className="form-container">
          <p>Register for Free</p>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form autoComplete="off">
            <input
              type="email"
              placeholder="Email"
              name="email_field"
              autoComplete="new-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password_field"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              name="name_field"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button type="button" onClick={register}>
              Register
            </button>
          </form>

          <p>
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    );
  }
};

export default LoginPage;
