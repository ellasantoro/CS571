import React, { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import crest from "../../assets/uw-crest.svg";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

/**
 * This file is responsible for the layout of the website, like navlinks
 * 
 * @param {*} props 
 * @returns structural instance badger layout
 */
function BadgerLayout(props) {
  // TODO @ Step 6:
  // You'll probably want to see if there is an existing
  // user in sessionStorage first. If so, that should
  // be your initial loginStatus state.
  const initialLoginStatus = JSON.parse(sessionStorage.getItem("loggedIn"));
  const [loginStatus, setLoginStatus] = useState(initialLoginStatus);

  //only include the login and register buttons if the use is not logged in,
  //if the user is login, don't display login or register, just display logout.
  //these will be combined with the nav links that are there regardless of login 
  //statuses later.
  const sitePaths = () => {
    if (!loginStatus) {
      return (
        <>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="login">
            Login
          </Nav.Link>
          <Nav.Link as={Link} to="register">
            Register
          </Nav.Link>
        </>
      );
    } else {
      return (
        <>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="logout">
            Logout
          </Nav.Link>
        </>
      );
    }
  };
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img alt="BadgerChat Logo" src={crest} width="30" height="30" className="d-inline-block align-top"/>{" "}
            BadgerChat
          </Navbar.Brand>

          <Nav className="me-auto">
            {sitePaths()}
            <NavDropdown title="Chatrooms">
              {
                /* TODO Display a NavDropdown.Item for each chatroom that sends the user to that chatroom! */
                //map instead of listing individually - quicker! (inspired by past ICE's.)
                props.chatrooms.map((room) => {
                  return (
                    <NavDropdown.Item as={Link} to={`chatrooms/${room}`} key={room}>{room}</NavDropdown.Item>
                  );
                })
              }
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      <div style={{ margin: "1rem" }}>
        <BadgerLoginStatusContext.Provider
          value={[loginStatus, setLoginStatus]}
        >
          <Outlet />
        </BadgerLoginStatusContext.Provider>
      </div>
    </div>
  );
}

export default BadgerLayout;
