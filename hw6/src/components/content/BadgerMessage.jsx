import React from "react";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";

/**
 * This file is responsible for the individual badger message cards in the badger chatrooms.
 * 
 * @param {*} props 
 * @returns badger message instance
 */
function BadgerMessage(props) {
  const dt = new Date(props.created);
  //grab login info from session storage
  const loggedIn = sessionStorage.getItem("loggedIn") === "true";
  const username = sessionStorage.getItem("username");

  const handleDelete = () => {
    props.handleDeleteSubmit(props.id);
  };

  //given card & styling, added handledelete if poster is the logged in user (and if there is even a user logged in)
  return (
    <Card style={{ margin: "0.5rem", padding: "0.5rem" }}>
      <h2>{props.title}</h2>
      <sub>
        Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}
      </sub>
      <br />
      <i>{props.poster}</i>
      <p>{props.content}</p>
      {loggedIn && props.poster === username ? (
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
      ) : null}
    </Card>
  );
}

export default BadgerMessage;
