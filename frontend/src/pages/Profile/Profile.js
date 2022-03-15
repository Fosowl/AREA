import React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import api from "api/Api";
import { Account } from "api/Account";
import UserPath from "../../assets/images/user.png";

import Header from "components/Header";
import IsLoadingHOC from "components/IsLoadingHOC";
import EditableText from "components/EditableText";
import { useNavigate } from "react-router-dom";

import "./Profile.scss";

let account = undefined;

function Profile(props) {
  const { isLoading, setIsLoading } = props;
  const [UserInfo, setUserInfo] = useState({});
  const [ImageUser, setImageUser] = useState(UserPath);
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("No email");

  // Is the account class of the api
  const [account, setAccount] = useState(undefined);
  const navigate = useNavigate();

  const tryRequire = (path) => {
    try {
      return require(`${path}`);
    } catch (err) {
      return null;
    }
  };

  function changeEmail(value) {
    setEmail(value);
  }

  // function changeUsername(value) {
  //   setUsername(value);
  // }

  function changeImage() {
    console.log("image clicked");
  }

  // function changeUsername() {
  //   console.log("username clicked");
  // }

  function removeAccount() {
    if (window.confirm("Are you sure you want to delete your account ?")) {
      account.delete();
      localStorage.removeItem("token");
      alert("Account deleted, you will now be logged out !");
      window.location.reload(false);
    } else {
    }
  }

  function saveAccount() {
    const firstName = undefined;
    const phoneNumber = undefined;
    const lastName = undefined;
    account.update({
      firstName,
      lastName,
      phoneNumber,
      picture: ImageUser,
      pseudo: Username,
    });
    alert("Account informations saved !");
  }

  function logoutAccount() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // redirect to login page
      navigate("/login");
      return;
    } else {
      setAccount(new Account(token));
    }
  }, []);

  // On account var change
  useEffect(() => {
    console.log(account);
    if (account !== undefined) {
      (async () => {
        let infos = await account.get_info();
        if (infos !== null) {
          setUserInfo(infos);
          if (tryRequire(infos.picture)) {
            setImageUser(infos.picture);
          }
          setUsername(infos.pseudo);
          setEmail(infos.email);
        } else {
          console.log("fetch failure, value null");
        }
        setIsLoading(false);
      })();
    }
  }, [account]);

  return (
    <>
      <Header page="profile" />
      {!isLoading && (
        <Grid container spacing={2} align="center">
          <Grid item xs={2} md={2}></Grid>
          <Grid item xs={8} md={8}>
            <Stack className="stack-wrap" spacing={2}>
              <Grid container spacing={1} align="center">
                <Grid item xs={3} md={3}>
                  <button className="delete-btn" onClick={removeAccount}>
                    <b>Remove account</b>
                  </button>
                </Grid>
                <Grid item xs={6} md={6}>
                  <img
                    src={ImageUser}
                    onClick={changeImage}
                    loading="lazy"
                    alt="Failed to load image"
                    className="image-user"
                  />
                </Grid>
                <Grid item xs={3} md={3}>
                  <button className="logout-btn" onClick={logoutAccount}>
                    <b>Logout</b>
                  </button>
                </Grid>
              </Grid>
              <EditableText
                display={Username}
                onInputChange={(text) => setUsername(text)}
              />
              <EditableText display={Email} onInputChange={changeEmail} />
              <br />
              <button className="save-btn" onClick={() => alert("Cannot perform your request, please contact Alexis to fix this error :)")}>
                <b>Save changes</b>
              </button>
            </Stack>
          </Grid>
          <Grid item xs={2} md={2}></Grid>
        </Grid>
      )}
    </>
  );
}

export default IsLoadingHOC(Profile);
