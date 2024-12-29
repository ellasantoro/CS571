import React, {useContext, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import BadgerBudSummary from "../../BadgerBudSummary";
import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext";

export default function BadgerBudsAdoptable(props) {
  //useContext and BadgerBudsDataContext used instead of fetch
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
  const unsavedCats = cats.filter(cat => !savedCatIds.includes(cat.id) && !adoptedCatIds.includes(cat.id));


  //functionality for saving the cat -> takes in catId to save the specific cat, and catName
  //so that we can actually display the cat's name in the alert.
  const saveCat = (catId, catName) => {
    //create new array with all the id's from savedcats that were already there, and
    //basically appending the new cat to it
    const newSavedCatIds = [...savedCatIds, catId];
    setSavedCatIds(newSavedCatIds);

    //alert the user that the cat has been added!
    alert(`${catName} has been added to your basket!`);
  };

  //every time savedCatIds changes, it updates that information in sessionStorage so that
  //the data is saved even after page reloads or different page navigations (if its in the same
  //browser section)
  useEffect(() => {
    //the following line was taken from lecture 10 notes
    sessionStorage.setItem("savedCatIds", JSON.stringify(savedCatIds));
  }, [savedCatIds]);

  return (
    <div>
      <h1>Available Badger Buds</h1>
      <p>The following cats are looking for a loving home! Could you help?</p>
      {
        //if there are no unsaved cats (meaning every cat is saved), then we should
        //display a no available cats message, otherwise display the BaderBudSummary for
        //each cat:
      }
      {unsavedCats.length === 0 ? (
        <p>No buds are available for adoption!</p>
      ) : (
        <Row>
          {unsavedCats.map((cat) => (
            <Col key={cat.id} xs={12} md={6} lg={4} xl={3}>
              <BadgerBudSummary cat={cat} saveCat={saveCat} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
