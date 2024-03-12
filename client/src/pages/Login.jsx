import React, { useState } from "react";
import toast from "react-hot-toast";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passType, setPassType] = useState("password");

  const togglePass = () => {
    if (passType === "text") setPassType("password");
    else if (passType === "password") setPassType("text");
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!emailRegex.test(email))
      toast.error("Invalid Email Adress", { duration: 2000 });
    else if (password.length < 4)
      toast.error("Password must be Atleast 4 characters", { duration: 2000 });
    else {
      //send Request to serer
      axios
        .post(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
          email,
          password,
        })
        .then((response) => {
          if (response.data.message === "Login successful") {
            toast.success(response.data.message);
            Cookies.set("token", response.data.token, { expires: 2 });
            Cookies.set(
              "name",
              `${response.data.name}-${response.data.profile_pic}`,
              { expires: 2 }
            );
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border border-slate-400 p-4 custom-shadow">
        <h1 className="text-2xl text-center">Login to your Account</h1>
        <form
          action=""
          className="flex flex-col gap-5 m-5 items-start justify-center"
          onSubmit={submitForm}
        >
          <div className="flex flex-col">
            <label htmlFor="">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
              className="outline-none px-2 py-1 rounded-sm"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Password</label>
            <div className="flex items-center gap-2">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={passType}
                placeholder="Password"
                className="outline-none px-2 py-1 rounded-sm"
              />
              <div
                onClick={togglePass}
                className="cursor-pointer w-4 flex justify-center items-center"
              >
                {passType === "text" ? (
                  <i className="fa-regular fa-eye"></i>
                ) : (
                  <i className="fa-regular fa-eye-slash"></i>
                )}
              </div>
            </div>

            <a href="" className="underline text-right mr-6 text-blue-800">
              Forgot Password?
            </a>
          </div>

          <button className="bg-[#282C75] px-5 py-1.5 text-white rounded-md">
            Login
          </button>
        </form>
        <p className="text-center">
          Dont have an account?{" "}
          <a className="underline text-blue-700" href="/SignUp">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
