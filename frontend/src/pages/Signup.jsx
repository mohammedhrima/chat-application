import React, { useState } from 'react'
import "./styles/Form.css"
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import { ClearRoute, SignupRoute } from "../api/routes"
import { toastOptions } from '../global';

const inputFields = [
  { type: "text", placeholder: "Username", name: "username" },
  { type: "email", placeholder: "Email", name: "email" },
  { type: "password", placeholder: "Password", name: "password" },
  { type: "password", placeholder: "Confirm Password", name: "confirmPassword" },
];

function Signup() {
  const navigate = useNavigate();
  useEffect(() => { if (localStorage.getItem("user")) navigate("/") }, []);

  const [values, setValues] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const checkForm = () => {
    const { password, confirmPassword, username, email } = values;
    const validations = [
      { cond: password !== confirmPassword, msg: "Password and confirm password should be the same." },
      { cond: username.length < 3, msg: "Username should be greater than 3 characters." },
      { cond: password.length < 8, msg: "Password should be equal to or greater than 8 characters." },
      { cond: email === "", msg: "Email is required." },
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
      const { email, username, password } = values;
      const { data } = await axios.post(SignupRoute, { username, email, password });
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
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </>
  )
}

export default Signup