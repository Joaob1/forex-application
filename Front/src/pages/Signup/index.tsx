import "./style.css";
import { useNavigate } from "react-router-dom";
import * as io from "socket.io-client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Error from "../../components/Error";
import Success from "../../components/Success";
const openedEye = require("../../assets/OpenedEye.png");
const closedEye = require("../../assets/ClosedEye.png");
const socket = io.connect("http://localhost:4000");
interface Form {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}
export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [eyes, setEyes] = useState({
    eye1: false,
    eye2: false,
  });
  useEffect(() => {
    if (localStorage.getItem("email")) {
      navigate("/main");
    }
  }, [navigate]);
  useEffect(() => {
    socket.on(
      "registerReturn",
      (data: { error?: string; message?: string }) => {
        data.error && showMessage(data.error, true);
        if (data.message) {
          showMessage(data.message, false, true);
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        }
      }
    );
  }, [navigate]);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (form.password !== form.repeatPassword) {
      return showMessage("Passwords do not match", true);
    }
    try {
      socket.emit("register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
    } catch (error) {
      return showMessage("System error", true);
    }
  };
  const handleChangeInput = (e: any) => {
    const value = e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };
  const clearForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    });
  };
  const showMessage = (message: string, error?: boolean, success?: boolean) => {
    if (error) {
      setErrorMessage(message);
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
    if (success) {
      setSuccessMessage(message);
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    }
  };
  return (
    <div className="container-signup">
      {errorMessage && <Error message={errorMessage} />}
      {successMessage && <Success message={successMessage} />}
      <form className="card-signup" onSubmit={(e) => handleSubmit(e)}>
        <h1>Register</h1>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          required
          id="name"
          name="name"
          value={form.name}
          onChange={handleChangeInput}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          required
          id="email"
          name="email"
          value={form.email}
          onChange={handleChangeInput}
        />
        <label htmlFor="password">Password</label>
        <input
          type={eyes.eye1 ? "text" : "password"}
          required
          id="password"
          name="password"
          value={form.password}
          onChange={handleChangeInput}
        />
        <img
          src={eyes.eye1 ? openedEye : closedEye}
          alt="Show password"
          className="eye1"
          onClick={() => setEyes({ ...eyes, eye1: !eyes.eye1 })}
        />
        <label htmlFor="repeatPassword">Repeat Password</label>
        <input
          type={eyes.eye2 ? "text" : "password"}
          required
          id="repeatPassword"
          name="repeatPassword"
          value={form.repeatPassword}
          onChange={handleChangeInput}
        />
        <img
          src={eyes.eye2 ? openedEye : closedEye}
          alt="Show password"
          className="eye2"
          onClick={() => setEyes({ ...eyes, eye2: !eyes.eye2 })}
        />
        <span>
          Already have an account? <Link to="/signin">Sign in</Link>
        </span>
        <div className="buttons">
          <button type="button" onClick={clearForm}>
            Clear
          </button>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
