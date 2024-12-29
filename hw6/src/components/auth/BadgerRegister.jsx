import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * This file is responsible for the register functionality of the website. it posts the new
 * user to the url for the cs571 hw6 data, and it ensures that to register, you must enter the correct
 * format of username and password (and confirmed password) in order to successfully register.
 * 
 * @returns register instance
 */
export default function BadgerRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  function handleRegisterSubmit(e) {
    e.preventDefault();

    //regex to be used to ensure that the inputted username is a valid hexadecimal character
    const pinRegex = /^\d{7}$/;

    //NOTE: several lines below this point are taken from in class exercises and altered to fit the assignment brief.
    if (!username || !password) {
      alert("You must provide both a username and pin!");
      return; //stops it from continuing on, user needs to re-enter
    }

    //https://dev.to/fromwentzitcame/username-and-password-validation-using-regex-2175
    //search query : "how to check if a password is a specific regex format in react js"
    //learned: .test() to compare text against a regex pattern.
    if (!pinRegex.test(password)) {
      alert("Your pin must be a 7-digit number!");
      return; //stops it from continuing on, user needs to re-enter
    }

    if (password !== repeatPassword) {
      alert("Your pins do not match!");
      return; //stops it from continuing on, user needs to re-enter
    }

    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw6/register", {
      method: "POST",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: username,
        pin: password,
      }),
    }).then((res) => {
      //After receiving a response from the API, you should handle the following cases...
      //200 - success
      //400 - does not contain username and pin
      //400 - pin is not exactly 7 digits
      //409 - username already exists
      //413 - username is longer than 64 characters
      if (res.status === 200) {
        alert("You have been registered!");
        navigate("/");
      } else if (res.status === 400) {
        if (pin.toString.length() !== 7) {
          alert("A pin must exactly be a 7-digit PIN code passed as a string.");
        }
        if (pin === null || username === null) {
          alert("A request must contain a 'username' and 'pin");
        }
      } else if (res.status === 409) {
        alert("The user already exists!");
      } else if (res.status === 413) {
        alert("'username' must be 64 characters or fewer");
      }
    });
  }

  return (
    <>
      <h1>Register</h1>
      <Form onSubmit={handleRegisterSubmit}>
        <Form.Label htmlFor="usernameInput">Username</Form.Label>
        <Form.Control id="usernameInput" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <Form.Label htmlFor="passwordInput">Password</Form.Label>
        <Form.Control id="passwordInput" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <Form.Label htmlFor="rePasswordInput">Repeat Password</Form.Label>
        <Form.Control id="rePasswordInput" type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}/>
        <br/>
        <Button style={{backgroundColor: "#9dc295", borderColor:"#6c8767"}} onClick={handleRegisterSubmit}>Register</Button>
      </Form>
    </>
  );
}
