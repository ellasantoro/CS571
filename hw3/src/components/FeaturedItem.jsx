import { useState, useEffect } from "react";
import { Card, Button, Table } from "react-bootstrap";
export default function FeaturedItem(props) {
  const [nutrition, setNutritionState] = useState(false);
  function handleNutrition() {
    //flip the nutrition state
    setNutritionState(!nutrition);
  }
  return (
    //Rubric #5 - uses card component, also uses styling.
    //Card style inspired by ICE - web dev 1, modified to match preferences
    <Card style={{ margin: "auto", marginTop: "1rem", maxWidth: "30rem" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {
          //Rubric #2: Display the featured item - includes alt tag. (centered using flexbox div)
        }
        <img src={props.img} width="250px" alt={props.name} />
      </div>
      <h2>
        <strong>{props.name}</strong>
      </h2>
      <p>
        <strong>${props.price} per unit</strong>
      </p>
      <p>{props.description}</p>
      {nutrition && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h3>Nutrition Facts</h3>
        </div>
      )}
      {nutrition && (
        //table style taken from: https://react-bootstrap.netlify.app/docs/components/table/
        //Rubric #4: Show nutrition facts, only shows when button is clicked
        //Handles macroingredients (Calories, protein, fat were the only ones included in the array for
        //salmon, but the writeup showed carbs too. If ingredient is not present, it will show 0g.)
        //Rubric #5: boostrap table component - uses striped bordered hover sa style.
        //learned about table from https://react-bootstrap.github.io/docs/components/table/
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Calories</th>
              <th>Fat</th>
              <th>Carbohydrates</th>
              <th>Protein</th>
            </tr>
          </thead>
          <tbody>
            <td>{props.nutrition.calories || "0g"}</td>
            <td>{props.nutrition.fat || "0g"}</td>
            <td>{props.nutrition.carbohydrates || "0g"}</td>
            <td>{props.nutrition.protein || "0g"}</td>
          </tbody>
        </Table>
      )}
      {
        //Rubric #3: Button that is able to toggle
        //Button style taken from chatGPT - prompt was "what are some ways you can style a boostrap react button"
        //Rubric #5: Boostrapify featured item - Button. uses variant type outline-primary for style
      }
      <Button variant="outline-primary" onClick={handleNutrition}>
        {nutrition ? "Hide Nutrition Facts" : "Show Nutrition Facts"}
      </Button>
    </Card>
  );
}
