import React, { useEffect, useState } from 'react'
import "./styles/Form.css"
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import { ClearRoute, LoginRoute } from "../api/routes"
import { toastOptions } from '../global';

const inputFields = [
  { type: "text", placeholder: "Username", name: "username" },
  { type: "password", placeholder: "Password", name: "password" }
];


function Login() {
  const navigate = useNavigate();
  useEffect(() => { if (localStorage.getItem("user")) navigate("/") }, []);

  const [values, setValues] = useState({ username: "", password: "" });
  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const checkForm = () => {
    const { password, confirmPassword, username, email } = values;
    const validations = [
      { cond: username === "", msg: "Username is required." },
      { cond: password === "", msg: "Password is required." },
    ];
    for (const { cond, msg } of validations) {
      if (cond) {
        toast.error(msg, toastOptions);
        return false;
      }
    }
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (checkForm()) {
      const { username, password } = values;
      const { data } = await axios.post(LoginRoute, { username, password });
      if (data.status === false) toast.error(data.msg, toastOptions);
      else if (data.status === true) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="FormContainer">
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Chat App</h1>
          </div>
          {inputFields.map(({ type, placeholder, name }) => (
            <input key={name} type={type} placeholder={placeholder} name={name} onChange={handleChange} />
          ))}
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/signup">Create One.</Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  )
}

export default Login