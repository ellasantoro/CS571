import { useState, useEffect } from "react";
import FeaturedItem from "./FeaturedItem";

export default function BadgerMart(props) {
  //https://cs571api.cs.wisc.edu/rest/f24/hw3/featured-item
  const [feature, setFeature] = useState();

  useEffect(() => {
    //Rubric #1: Fetch the featured item, make sure to console log the data!
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw3/featured-item", {
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFeature(data);
      });
  }, []);

  return (
    <div>
      <h1>Welcome to BadgerMart!</h1>
      <div style={{ maxWidth: "40rem", margin: "auto", textWrap: "pretty" }}>
        <p>
          BadgerMart, located at the heart of the UW-Madison campus, is the
          go-to grocery store for students, faculty, and staff. Offering a wide
          range of products, including fresh produce, dairy, bakery items, meat,
          seafood, and pantry essentials, BadgerMart ensures that the university
          community has access to everything they need. With exclusive student
          discounts, convenient online ordering, and meal kits designed for busy
          schedules, shopping at BadgerMart is both affordable and effortless.
        </p>
      </div>
      <h2>Today's Special</h2>
      {feature ? (
        <FeaturedItem {...feature} />
      ) : (
        <p>Today's feature is still loading...</p>
      )}
    </div>
  );
}
