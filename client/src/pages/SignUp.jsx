import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import data from "../data.json";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [passType, setPassType] = useState("password");
  const [selectedImage, setSelectedImage] = useState(0);

  const togglePass = () => {
    if (passType === "text") setPassType("password");
    else if (passType === "password") setPassType("text");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const SubmitForm = (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) toast.error("Invalid Email Address");
    else if (displayName.length < 4)
      toast.error("Display Name must be ateast 4 character");
    else if (password.length < 4)
      toast.error("Password must be atleast 4 characters");
    else {
      //sign in a user

      axios
        .post(`${import.meta.env.VITE_SERVER_URL}/auth/create-account`, {
          email,
          password,
          displayName,
          pfp: selectedImage,
        })
        .then((response) => {
          if (response.data.message === "Account created successfully") {
            toast.success(response.data.message);
            Cookies.set("token", response.data.token, { expires: 2 });
            Cookies.set(
              "name",
              `${response.data.name}-${response.data.profile_pic}`,
              {
                expires: 2,
              }
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
        <h1 className="text-2xl text-center">Create New Account</h1>
        <form
          action=""
          onSubmit={SubmitForm}
          className="flex flex-col gap-5 m-5 items-start justify-center"
        >
          <div className="flex gap-16 items-center">
            <div>
              <div className="flex flex-col">
                <label htmlFor="">Email</label>
                <input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="outline-none px-2 py-1 rounded-sm"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="">Display Name</label>
                <input
                  onChange={(e) => setDisplayName(e.target.value)}
                  type="text"
                  placeholder="Display Name"
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
              </div>
            </div>
            <div className="flex flex-col gap-4 items-center">
              <p>Choose your Profile Picture</p>
              <img
                src={data.pfps[selectedImage]}
                className="h-28 rounded-full"
                alt=""
              />
              <div className="grid grid-cols-4 gap-2">
                {data.pfps.map((e, i) => (
                  <img
                    onClick={() => setSelectedImage(i)}
                    src={e}
                    className="h-16 rounded-full cursor-pointer"
                    alt=""
                  />
                ))}
              </div>
            </div>
          </div>
          <button className="bg-[#282C75] px-5 py-1.5 text-white rounded-md">
            CREATE ACCOUNT
          </button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <a className="underline text-blue-700" href="/login">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
