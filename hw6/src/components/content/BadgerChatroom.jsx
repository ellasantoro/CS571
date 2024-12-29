import { useEffect, useState, useContext } from "react";
import BadgerMessage from "./BadgerMessage";
import { Col, Container, Row, Pagination, Form, Button } from "react-bootstrap";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

/**
 * This file is responsible for handling the chatrooms for the website. It allows users to post if logged in,
 * and delete posts of their own if they are logged in and have posts. It also maintains login status data
 * from other files, and it uses pagination to show the first 4 pages of messages.
 * 
 * @param {*} props 
 * @returns chatroom instances
 */
export default function BadgerChatroom(props) {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [loginStatus] = useContext(BadgerLoginStatusContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const loadMessages = () => {
    fetch(
      `https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${props.name}&page=${page}`,
      {
        method: "GET",
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setMessages(json.messages);
      });
  };

  useEffect(loadMessages, [props, page]);

  const handlePostSubmit = (e) => {
    e.preventDefault();

    fetch(
      `https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${props.name}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      }
    ).then((res) => {
      if (res.status === 200) {
        alert("Successfully posted message!");
        //clear the input fields because the message has been posted
        setTitle("");
        setContent("");
        //reload the messages immediately
        loadMessages();
        //handle non-success statuses
      } else if (res.status === 400) {
        alert("A request must contain a title and content");
      } else if (res.status === 401) {
        alert("You must be logged in to do that!");
      } else if (res.status === 404) {
        alert(
          "The specified chatroom does not exist. Chatroom names are case-sensitive."
        );
      } else if (res.status === 413) {
        alert(
          "'title' must be 128 characters or fewer and 'content' must be 1024 characters or fewer"
        );
      } else {
        alert("Something went wrong :,(");
      }
    });
  };

  const handleDeleteSubmit = (userID) => {
    fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?id=${userID}`, {
      method: "DELETE",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => {
      if (res.status === 200) {
        alert("Successfully deleted the message!");
        loadMessages();
      } else if (res.status === 401) {
        alert("You must be logged in to do that!");
      } else if (res.status === 404) {
        alert("That message does not exist!");
      } else {
        alert("Something went wrong :,(");
      }
    });
  };

  return (
    <>
      <h1>{props.name} Chatroom</h1>
      <hr />
      {loginStatus ? (
        <>
          <Form onSubmit={handlePostSubmit}>
            <Form.Group controlId="postTitle">
              <Form.Label id="title">Post Title</Form.Label>
              <Form.Control htmlFor="title" type="text" placeholder="A captivating title" value={title} onChange={(e) => setTitle(e.target.value)}/>
            </Form.Group>
           <br/>
            <Form.Group controlId="postContent">
              <Form.Label id="content">Post Content</Form.Label>
              <Form.Control htmlFor="content" as="textarea" rows={3} placeholder="A very interesting post..." value={content} onChange={(e) => setContent(e.target.value)}/>
            </Form.Group>
            <br/>
            <Button style={{backgroundColor: "#8a6a4c", borderColor:"#6c8767"}} variant="primary" type="submit" disabled={!title.trim() || !content.trim()}>Create Post</Button>
          </Form>
        </>
      ) : (
        <p>You must be logged in to post!</p>
      )}
      <hr/>

      {messages.length > 0 ? (
        <Container fluid>
          <Row>
            <Col xs={12} sm={8} md={6} lg={12} xl={12}>
              <Container fluid>
                <Row>
                  {messages.map((message) => (
                    <Col key={message.id} xs={12} lg={6} xl={4} xxl={3}>
                      <BadgerMessage {...message} user={loginStatus} handleDeleteSubmit={handleDeleteSubmit}/>
                    </Col>))}
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      ) : (
        <p>There are no messages on this page yet!</p>
      )}
  {
    //handle pagination (copied & changed from past project)
    //note: the api takes care of the 25 posts / page dilemma
  }
      <Row>
        <Pagination>
          <Pagination.Item active={page === 1} onClick={() => setPage(1)}>
            1
          </Pagination.Item>
          <Pagination.Item active={page === 2} onClick={() => setPage(2)}>
            2
          </Pagination.Item>
          <Pagination.Item active={page === 3} onClick={() => setPage(3)}>
            3
          </Pagination.Item>
          <Pagination.Item active={page === 4} onClick={() => setPage(4)}>
            4
          </Pagination.Item>
        </Pagination>
      </Row>
    </>
  );
}
