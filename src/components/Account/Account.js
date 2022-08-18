import styles from "./Account.module.css";
import { LogOut, Edit2, Trash, GitHub, Paperclip, Camera } from "react-feather";
import InputControl from "../InputControl/InputControl";
import { Link, Navigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { auth, uploadImage, updateUserDatabase } from "../../firebase";
import { signOut } from "firebase/auth";
function Account(props) {
  const userDetails = props.userDetails;
  const isAuthenticated = props.auth;
  const imagePicker = useRef();
  const [progress, setProgress] = useState(0);
  const [profileImageUploadStarted, setProfileImageUploadStarted] =
    useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(
    userDetails.profileImage ||
      "https://cdn.pixabay.com/photo/2021/02/23/09/26/cat-6042858__340.jpg"
  );
  const [userProfileValues, setUserProfileValues] = useState({
    name: userDetails.name || "",
    designation: userDetails.designation || "",
    github: userDetails.github || "",
    linkedin: userDetails.linkedin || "",
  });
  const [showSaveDetailsButton, setShowSaveDetailsButton] = useState(false);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleLogout = async () => {
    await signOut(auth);
  };
  const handleCameraClick = () => {
    imagePicker.current.click();
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setProfileImageUploadStarted(true);
    uploadImage(
      file,
      (progress) => {
        setProgress(progress);
      },
      (url) => {
        setProfileImageUrl(url);
        updateProfileImageToDatabase(url);
        setProfileImageUploadStarted(false);
        setProgress(0);
      },
      (err) => {
        console.error("Error->", err);
        setProfileImageUploadStarted(true);
      }
    );
  };
  const saveDetailsToDatabase = async () => {
    if (!userProfileValues.name) {
      setErrorMessage("Name required");
      return;
    }

    setSaveButtonDisabled(true);
    await updateUserDatabase({ ...userProfileValues }, userDetails.uid);
    setSaveButtonDisabled(false);
    setShowSaveDetailsButton(false);
  };
  const updateProfileImageToDatabase = (url) => {
    updateUserDatabase(
      { ...userProfileValues, profileImage: url },
      userDetails.uid
    );
  };
  const handleInputChange = (event, property) => {
    setShowSaveDetailsButton(true);

    setUserProfileValues((prev) => ({
      ...prev,
      [property]: event.target.value,
    }));
  };
  return isAuthenticated ? (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.heading}>
          Welcome <span>{userProfileValues.name}</span>
        </p>
        <div className={styles.logout} onClick={handleLogout}>
          <LogOut></LogOut> Logout
        </div>
      </div>
      <input
        ref={imagePicker}
        type="file"
        name=""
        id=""
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <div className={styles.section}>
        <div className={styles.title}>Your Project</div>
        <div className={styles.profile}>
          <div className={styles.left}>
            <div className={styles.image}>
              <img src={profileImageUrl} alt="Profile Image" />
              <div className={styles.camera} onClick={handleCameraClick}>
                <Camera></Camera>
              </div>
            </div>
            {profileImageUploadStarted ? (
              <p className={styles.progress}>
                {progress == 100
                  ? "Getting image url..."
                  : `${progress.toFixed(2)}% uploaded`}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className={styles.right}>
            <div className={styles.row}>
              <InputControl
                label="Name"
                placeholder="Enter your Name"
                value={userProfileValues.name}
                onChange={(event) => handleInputChange(event, "name")}
              />
              <InputControl
                label="Title"
                value={userProfileValues.designation}
                placeholder="eg. Full stack developer"
                onChange={(event) => handleInputChange(event, "designation")}
              />
            </div>
            <div className={styles.row}>
              <InputControl
                label="Github"
                value={userProfileValues.github}
                placeholder="Enter your github link"
                onChange={(event) => handleInputChange(event, "github")}
              />
              <InputControl
                label="Linkedin"
                value={userProfileValues.linkedin}
                placeholder="Enter your linkedin link"
                onChange={(event) => handleInputChange(event, "linkedin")}
              />
            </div>
            <div className={styles.footer}>
              <p className={styles.error}>{errorMessage}</p>
              {showSaveDetailsButton && (
                <button
                  disabled={saveButtonDisabled}
                  className={"button"}
                  onClick={saveDetailsToDatabase}
                >
                  Save Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/"></Navigate>
  );
}

export default Account;
