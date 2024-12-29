import React, { useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

/**
 * This file is responsible for the logout funcitonality of the website. It successfully logs a user
 * out by clearing the username and login status from the storage session (and updating the loginstatus using the
 * instance of BadgerLoginStatus), thus successfully causing the rest of the website to react accordingly. It also returns
 * the user to the home page (other logout changes occur in layout in response to the logged in status being changed.)
 * 
 * @returns logout instance
 */
export default function BadgerLogout() {
  const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw6/logout", {
      method: "POST",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        //clear the session storage and set the login status to false. now we have returned to a logged out state.
        setLoginStatus(false);
        sessionStorage.clear();
        //return to home
        navigate("/");
      });
  }, []);

  return (
    <>
      <h1>Logout</h1>
      <p>You have been successfully logged out.</p>
    </>
  );
}
