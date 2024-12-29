import React, { useContext, useState, useEffect } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import BadgerBudSummary from "../../BadgerBudSummary";
import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext";

export default function BadgerBudsBasket(props) {
  //use useContext and BadgerBudsDataContext instead of fetch
  const cats = useContext(BadgerBudsDataContext);

  const [savedCatIds, setSavedCatIds] = useState([]);
  const [adoptedCatIds, setAdoptedCatIds] = useState([]);
  useEffect(() => {
    //the next two following lines are taken and edited from lecture 10 PowerPoint.
    const saved = JSON.parse(sessionStorage.getItem("savedCatIds")) || [];
    const adopted = JSON.parse(sessionStorage.getItem("adoptedCatIds")) || [];
    //update cat ids
    setSavedCatIds(saved);
    setAdoptedCatIds(adopted);
  }, []);

  //filter through cats array to only show the cats that are not saved or adopted
  const savedCats = cats.filter(
    (cat) => savedCatIds.includes(cat.id) && !adoptedCatIds.includes(cat.id)
  );

  const handleUnselect = (catId, catName) => {
    //alert the user that  the cat has been removed
    alert(`${catName} has been removed from your basket!`);

    //update saved cats by removing the specific catID
    //CHATGPT Usage note: I gave chatGPT my 4 line code that made up
    //the logic of the following 1 line and asked if it could reduce it for me.
    //I was using a forEach loop, and knew that iterative wasn't the best way to
    //do it, so I'm happy to learn about this new trick using !== to remove the catId!
    const updatedSavedCatIds = savedCatIds.filter((id) => id !== catId);
    //taken from lecture 10:
    sessionStorage.setItem("savedCatIds", JSON.stringify(updatedSavedCatIds));
    setSavedCatIds(updatedSavedCatIds);
  };

  const handleAdopt = (catId, catName) => {
    //alert the user that the cat has been adopted
    alert(`${catName} has been adopted!`);

    //update the adopted cats list by appending the new cat to it
    const updatedAdoptedCatIds = [...adoptedCatIds, catId];
    //ensure this information gets updated across page refreshes/navigations using sessionStorage
    sessionStorage.setItem(
      "adoptedCatIds",
      JSON.stringify(updatedAdoptedCatIds)
    );
    setAdoptedCatIds(updatedAdoptedCatIds);

    //remove the cat from the saved cats list (since we added it to the adopted cats list)
    //Note about ChatGPT usage - this line is copied from line 32, which used chatGPT for logic
    //fix. See note up there for full explanation.
    const updatedSavedCatIds = savedCatIds.filter((id) => id !== catId);
    //taken from lecture 10 notes:
    sessionStorage.setItem("savedCatIds", JSON.stringify(updatedSavedCatIds));
    setSavedCatIds(updatedSavedCatIds);
  };

  console.log("Saved Cats:", savedCats);
  return (
    <div>
      <h1>Badger Buds Basket</h1>
      <p>These cute cats could be all yours!</p>
      {
        //if the length of the savedCats array is 0, we should display a message saying there are
        //no cats in the basket, otherwise display the cats:
      }
      {savedCats.length === 0 ? (
        <p>You have no buds in your basket!</p>
      ) : (
        <Row>
          {savedCats.map((cat) => (
            <Col key={cat.id} xs={12} md={6} lg={4} xl={3}>
              <Card
                className="saved-buddy display-box"
                style={{ marginBottom: "2em" }}
              >
                <Card.Img
                  variant="top"
                  src={`https://raw.githubusercontent.com/CS571-F24/hw5-api-static-content/main/cats/${cat.imgIds[0]}`}
                  alt={`A picture of ${cat.name}`}
                  style={{
                    height: "400px",
                    aspectRatio: "1:1",
                    objectFit: "cover",
                  }}
                />
                <Card.Body style={{ textAlign: "center" }}>
                  <Card.Title>
                    <strong>{cat.name}</strong>
                  </Card.Title>
                  <div className="bud-actions">
                    <Button
                      variant="danger"
                      style={{ marginRight: "1em" }}
                      onClick={() => handleUnselect(cat.id, cat.name)}
                    >
                      💔 Unselect
                    </Button>
                    <Button
                      variant="success"
                      className="adopt-button"
                      onClick={() => handleAdopt(cat.id, cat.name)}
                    >
                      🤍 Adopt
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
