import React, { useEffect, useState } from "react";
import img from "../assets/homePage.png";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useScreenSize from "../utils/screenSize";

export default function HomePage() {
  const screenSize = useScreenSize();

  const navigate = useNavigate();
  const getStarted = () => {
    if (!Cookies.get("token") || Cookies.get("token").length < 1) {
      navigate("/login");
    } else navigate("/dashboard");
  };

  // useEffect(() => {
  //   console.log(screenSize);
  //   Cookies.remove("token");
  //   Cookies.remove("name");
  // }, []);

  return (
    <div>
      {screenSize === "large" || screenSize === "medium" ? (
        <div className="flex justify-end m-8 mx-2 md:mx-24 gap-10 text-white font-semibold ">
          <a href="/SignUp" className="bg-[#282C75] px-5 py-1.5 rounded-lg">
            Sign up
          </a>
          <a href="/Login" className="bg-[#282C75] px-5 py-1.5 rounded-lg">
            Login
          </a>
        </div>
      ) : null}

      <div className="flex md:flex-row flex-col-reverse items-center md:gap-28 gap-4 justify-between mx-6 md:mx-32">
        <div className="text-xl py-10 md:py-0 font-medium leading-6 flex-1">
          <h1 className="text-5xl font-bold underline  text-[#342C88] leading-[60px] my-4">
            LiLong
          </h1>
          <div className="flex flex-col gap-3.5">
            <p>A Place where you can Listen Along</p>
            <p className="">
              Lilong lets you listen to songs together with friends and loved
              ones.{" "}
            </p>{" "}
            <p>
              No annoying ads, No pop-ups, No interruptions. Just you, your
              friends, and your perfect playlist.
            </p>
            <p>
              Create a playlist, start a listening party, invite your friends
              and dive into the trance of your music.
            </p>
          </div>
          <button
            onClick={getStarted}
            className="bg-[#282C75] px-5 py-1.5 rounded-lg text-white relative top-4 md:top-10"
          >
            Get Started
          </button>
        </div>
        <img src={img} className="md:h-[500px] flex-1" alt="" />
      </div>
    </div>
  );
}
