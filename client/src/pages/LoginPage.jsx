import React, { useState } from "react";
import "../styles/Login.scss";
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Alert from "../components/alert"; // Import the Alert component
import { baseUrl } from "../Urls";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      /* Get data after fetching */
      const loggedIn = await response.json();

      if (loggedIn.user) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        setAlertMessage("Login successful!");
        setShowAlert(true);
        setTimeout(() => {
          navigate("/"); // Short delay before navigation
        }, 1000);
      } else {
        setAlertMessage(loggedIn.message || "Login failed");
        setShowAlert(true);
      }
    } catch (err) {
      setAlertMessage("Login failed: " + err.message);
      setShowAlert(true);
    }
  };

  const handleGuestLogin = async () => {
    // Setting default guest email and password
    setEmail("guest@gmail.com");
    setPassword("Guest@123");

    // Trigger the form submission logic with guest credentials
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "guest@gmail.com", password: "Guest@123" }),
      });

      /* Get data after fetching */
      const loggedIn = await response.json();

      if (loggedIn.user) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        setAlertMessage("Login successful!");
        setShowAlert(true);
        setTimeout(() => {
          navigate("/"); // Short delay before navigation
        }, 1000);
      } else {
        setAlertMessage(loggedIn.message || "Login failed");
        setShowAlert(true);
      }
    } catch (err) {
      setAlertMessage("Login failed: " + err.message);
      setShowAlert(true);
    }
  };

  return (
    <div className="login">
      <div className="login_content">
        {showAlert && (
          <Alert
            message={alertMessage}
            onClose={() => setShowAlert(false)}
          />
        )} {/* Display alert message */}
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">LOG IN</button>
        </form>
        <a href="/register">Don't have an account? Sign In Here</a>
        <button
  onClick={handleGuestLogin}
  style={{
    width: "30%", 
    backgroundColor: "#dc3545", 
    color: "white", 
    border: "none", 
    borderRadius: "4px", 
    padding: "5px", 
    cursor: "pointer", 
    textAlign: "center",
    marginTop: "20px", 
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  }}
>
  Guest Login
</button>
      </div>
    </div>
  );
};

export default LoginPage;
