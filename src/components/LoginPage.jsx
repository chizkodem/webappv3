import React, { useEffect, useState } from "react";
import "../css/loginPage.css";
import { handleLogin } from "../services/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  return (
    <div className="">
      <form
        className="login-container"
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const user = await handleLogin(email, password);
            console.log("Welcome!", user);
          } catch (error) {
            alert("Login failed: " + error.message);
          }
        }}
      >
        <div className="login-input-container">
          <div className="login-input-content">
            <div className="login-input-dist">
              <div className="login-input-type">
                <input
                  className="login-input-is"
                  type="text"
                  required=""
                  placeholder="User"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="login-input-is"
                  type="password"
                  required=""
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <button className="login-submit-button">Log in</button>
      </form>
    </div>
  );
};

export default LoginPage;
