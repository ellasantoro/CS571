import React from "react";
import { useRef, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

/**
 * This file is responsible for the login component of the website. It sets
 * the login status, and only logs in a user if the username and password exist.
 * it finds this data by fetching and posting from/to the given URL for HW6
 * @returns login instance
 */
export default function BadgerLogin() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
  //https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();
  // TODO Create the login component.
  function handleLoginSubmit(e) {
    e?.preventDefault();

    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw6/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current.value,
        pin: passwordRef.current.value,
      }),
    }).then((res) => {
      if (res.status === 200) {
        alert("Successfully authenticated");
        //set loginstatus to true, and set the sessionstorage to true so we know across the website
        //and across refreshes that we are logged in. We will access this data in other places as well. 
        setLoginStatus(true);
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("username", usernameRef.current.value);
        //navigate to the home page after being logged in. 
        navigate("/");
      } else if (res.status === 400) {
        alert("A request must contain a 'username' and a 'pin'");
      } else if (res.status === 401) {
        alert("That username or pin is incorrect!");
      }
    });
  }

  return (
    <div style={{margin: "auto", width: "50%" }}>
    <Form onSubmit={handleLoginSubmit}>
      <Form.Label htmlFor="usernameInput">Username</Form.Label>
      <Form.Control id="usernameInput" ref={usernameRef}></Form.Control>
      <Form.Label htmlFor="passwordInput">Password</Form.Label>
      <Form.Control id="passwordInput" type="password" ref={passwordRef}></Form.Control>
      <br/>
      <Button style={{backgroundColor: "#dbabcb", borderColor:"#bd8fae"}} type="submit" onClick={handleLoginSubmit}>Login</Button>
    </Form>
    </div>
  );
}
