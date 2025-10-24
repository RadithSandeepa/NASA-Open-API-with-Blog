import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { validateEmail, validatePassword, sanitizeInput, validatePhone } from "../../utils/validators";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const { mode, isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  const navigateTo = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // Input validation
    if (!name || sanitizeInput(name).length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }
    if (!validatePhone(phone)) {
      toast.error("Phone number must be 10-15 digits");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters, include a letter and a number");
      return;
    }
    // Sanitize inputs
    const safeName = sanitizeInput(name);
    const safeEmail = sanitizeInput(email);
    const safePhone = sanitizeInput(phone);
    const safePassword = sanitizeInput(password);
    const formData = new FormData();
    formData.append("name", safeName);
    formData.append("email", safeEmail);
    formData.append("phone", safePhone);
    formData.append("password", safePassword);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        formData,
        {
          withCredentials: true,
        }
      );
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success(data.message);
      navigateTo("/home");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <article className={mode === "dark" ? "dark-bg" : "light-bg"}>
      <section className="auth-form">
        <form onSubmit={handleRegister}>
          <h1>REGISTER</h1>
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p>
            Already Registered? <Link to={"/login"}>Login Now</Link>
          </p>
          <button className="submit-btn" type="submit">
            REGISTER
          </button>
        </form>
      </section>
    </article>
  );
};

export default Register;
