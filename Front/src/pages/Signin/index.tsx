import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Error from "../../components/Error";
import * as io from "socket.io-client";
import "./style.css";
const openedEye = require("../../assets/OpenedEye.png");
const closedEye = require("../../assets/ClosedEye.png");
const socket = io.connect("http://localhost:4000");
interface Form {
  email: string;
  password: string;
}
export default function Signin() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({ email: "", password: "" });
  const [eye, setEye] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (localStorage.getItem("email")) {
      navigate("/main");
    }
  }, [navigate]);
  const handleChangeInput = (e: any) => {
    const value = e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    try {
      socket.emit("login", form);
    } catch (error) {
      return setErrorMessage("System error");
    }
  };

  useEffect(() => {
    socket.on(
      "loginResponse",
      (data: { name?: string; email?: string; error?: string }) => {
        if (data.error) {
          return setErrorMessage(data.error);
        } else if (data.email) {
          localStorage.setItem("email", data.email);
          setTimeout(() => {
            navigate("/main");
          }, 200);
        }
      }
    );
  });

  const setErrorMessage = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 4000);
  };
  return (
    <div className="container-signin">
      {error && <Error message={error} />}
      <form className="card-signin" onSubmit={(e) => handleSubmit(e)}>
        <h1>Login</h1>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          required
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => handleChangeInput(e)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          required
          name="password"
          type={eye ? "text" : "password"}
          value={form.password}
          onChange={(e) => handleChangeInput(e)}
        />
        <img
          src={eye ? openedEye : closedEye}
          className="eye"
          alt="Show Password"
          onClick={() => setEye(!eye)}
        />
        <span>
          Doesn't have an account? <Link to="/signup">Signup here</Link>
        </span>
        <button className="btn-login" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
