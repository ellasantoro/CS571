import { useState } from "react";
import { Button, Card, Carousel } from "react-bootstrap";

function BadgerBudSummary({ cat, saveCat }) {
  //create a useState variable and an updateShow functionality so that we have
  //the option to show more for each cat
  const [showMore, setShowMore] = useState(false);
  //basically negates the showMore button - if its already showing more, clicking it will
  //show less, and if it isn't showing more, it will simply show more.
  const updateShow = () => {
    setShowMore(!showMore);
  };

  //handle the save by updating the saveCat variable with the specific cat id and name
  const handleSave = () => {
    saveCat(cat.id, cat.name);
  };

  return (
    <Card className="card bg-light mb-3" style={{ marginBottom: "2em" }}>
      {showMore ? (
        <Carousel>
          {cat.imgIds.map((imgId, index) => (
            <Carousel.Item key={index}>
              <Card.Img
                src={`https://raw.githubusercontent.com/CS571-F24/hw5-api-static-content/main/cats/${imgId}`}
                alt={`A picture of ${cat.name}`}
                style={{ height: "400px", objectFit: "cover" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <Card.Img
          src={`https://raw.githubusercontent.com/CS571-F24/hw5-api-static-content/main/cats/${cat.imgIds[0]}`}
          alt={`A picture of ${cat.name}`}
          style={{ height: "400px", aspectRatio: "1:1", objectFit: "cover" }}
        />
      )}

      <Card.Body>
        <Card.Title
          className="fw-bold"
          style={{
            fontSize: "26px",
            lineHeight: "26.4px",
            fontFamily: "Tahoma, Verdana, Segoe, sans-serif",
            textAlign: "center",
          }}
        >
          {cat.name}
        </Card.Title>

        {showMore && (
          <div>
            <p>
              <strong> {cat.gender}</strong>
            </p>
            <p>
              <strong> {cat.breed}</strong>
            </p>
            <p>
              <strong> {cat.age} </strong>
            </p>
            {cat.description && (
              <p>
                <strong>Description:</strong> {cat.description}
              </p>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Button
            style={{ marginRight: "1em" }}
            variant="primary"
            onClick={updateShow}
          >
            {showMore ? "Show Less" : "Show More"}
          </Button>
          <Button variant="info" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
export default BadgerBudSummary;
