import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../api/routes";
import { toastOptions } from "../global";
import "./styles/SetAvatar.css";

function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  useEffect(() => { if (!localStorage.getItem("user")) navigate("/login") }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) toast.error("Please select an avatar", toastOptions);
    else {
      const user = await JSON.parse(localStorage.getItem("user"));
      try {
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, { image: avatars[selectedAvatar] });
        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/");
        } else toast.error("Error setting avatar. Please try again.", toastOptions);
      } catch (error) {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        try {
          const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`, { responseType: "arraybuffer" });
          const base64 = arrayBufferToBase64(response.data);
          data.push(base64);
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      }
      setAvatars(data);
      setIsLoading(false);
    };

    fetchAvatars();
  }, []);

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <>
      <div className="container">
        {isLoading && <img src={loader} alt="loader" className="loader" />}
        {!isLoading && (
          <>
            <div className="title-container">
              <h1>Pick an Avatar as your profile picture</h1>
            </div>
            <div className="avatars">
              {avatars.map((avatar, index) => {
                return (
                  <div className={`avatar ${selectedAvatar === index ? "selected" : ""}`} key={index} >
                    <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)}/>
                  </div>
                );
              })}
            </div>
            <button onClick={setProfilePicture} className="submit-btn">
              Set as Profile Picture
            </button>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default SetAvatar;
