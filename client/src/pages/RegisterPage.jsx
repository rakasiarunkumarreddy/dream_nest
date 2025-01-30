import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.scss";
import { baseUrl } from "../Urls";
import Alert from "../components/alert"; // Import the Alert component

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(""); // Email error state
  const [alertMessage, setAlertMessage] = useState(""); // Alert message state
  const [showAlert, setShowAlert] = useState(false); // Show alert state
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    );
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "profileImage" ? files[0] : value, // Ensure correct value for file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError(""); // Reset email error message before submission

    try {
      const register_form = new FormData();
      for (let key in formData) {
        register_form.append(key, formData[key]);
      }

      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        body: register_form,
      });

      const result = await response.json();

      if (response.ok) {
        setAlertMessage("Registration successful! Please log in.");
        setShowAlert(true);
        setTimeout(() => {
          navigate("/login");
        }, 1000); // Short delay before navigation
      } else {
        if (result.message === "User already exists!") {
          setEmailError("User already exists! Please use a different email.");
        } else {
          setAlertMessage(result.message || "Registration failed! Please try again.");
          setShowAlert(true);
        }
      }
    } catch (err) {
      console.log("Registration failed", err.message);
      setAlertMessage("An error occurred! Please try again.");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register_content">
        {showAlert && (
          <Alert
            message={alertMessage}
            onClose={() => setShowAlert(false)}
          />
        )} {/* Display alert message */}
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            required
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            required
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords do not match!</p>
          )}

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile photo" />
            <p>Upload Your Photo</p>
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile photo"
              style={{ maxWidth: "80px" }}
            />
          )}

          {emailError && <p style={{ color: "red" }}>{emailError}</p>} {/* Display email error */}

          <button type="submit" disabled={!passwordMatch || loading}>
            {loading ? "Submitting..." : "REGISTER"}
          </button>
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
