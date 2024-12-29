import { Text, View, Button, Alert, TouchableOpacity } from "react-native";
import BadgerSaleItem from "./BadgerSaleItem";
import { useEffect, useState } from "react";
import CS571 from "@cs571/mobile-client";

//USAGE NOTE: Some code is taken from ICE mobile web dev 1. 
export default function BadgerMart(props) {
  /*
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState("");
  */
  //can't use object notation like in ICE, must use array if you want to use .map:
  const [item, setItems] = useState([]);
  const [shownItem, setShownItem] = useState(0);
  //ChatGPT query: "How do I initialize a useState variable that is an array to have all 0s
  // in every index for a specified length" -> Array(# items).fill(0)
  //each index of the num items will essentially correlate to the index of each item
  const [numItems, setNumItems] = useState([]);
  const [cost, setCost] = useState(0);
  const [totItems, setTotItems] = useState(0);
  const [upperLimit, setUpperLimit] = useState([]);

  useEffect(() => {
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw7/items", {
      headers: {
        "X-CS571-ID":
          "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        //had to move initialization here instead of when creating the useState variable because
        //it is asynchronous, so we cant rely on items.length in the variable creation since we dont
        //know if we have that data yet. It makes more sense to put it here so that we know how many 0s
        //to fill with since we just got our data at this point in the code.
        setNumItems(Array(data.length).fill(0));
        const upperLimits = data.map((item) => item.upperLimit);
        console.log(upperLimits);
        setUpperLimit(upperLimits);
      });
  }, []);

  function handlePressNext() {
    if (shownItem < item.length - 1) {
      setShownItem(shownItem + 1);
    }
    //console.log(shownItem);
  }
  function handlePressPrev() {
    if (shownItem > 0) {
      setShownItem(shownItem - 1);
    }
    //console.log(shownItem);
  }

  function handlePressAdd() {
    //create a new array w/ spread operator because it will maintain the data even with different
    //state updates (essentially, we can go forward to a new object, go back to the old object, and 
    //the count will remain untouched because of this immutability feature of sread operator).
    const newNumItems = [...numItems];
    //ensure only adding and changing data when we are not exceeding the upperlimit 
    //this is just a safety precaution, because the button will be disabled anyway.
    if (newNumItems[shownItem] <= upperLimit[shownItem]) {
    //update fields total # items, cost, and the count for this specific item
      newNumItems[shownItem] += 1;
      setNumItems(newNumItems);
      setTotItems(totItems + 1);
      setCost(cost + item[shownItem].price);
    }
  }

  function handlePressSubtract() {
    //see note above about spread operator
    const newNumItems = [...numItems];
    //ensure that we only change / subtract from the data if we have at least 1 item (don't
    //want negative numbers).
    if (newNumItems[shownItem] > 0) {
      newNumItems[shownItem] -= 1;
      setNumItems(newNumItems);
      setTotItems(totItems - 1);
      setCost(cost - item[shownItem].price);
    }
  }

  function handleSubmit() {
    //https://reactnative.dev/docs/alert
    //use "", "" where the first string is the title as seen in the project writeup pictures
    Alert.alert(
      "Order Confirmed!",
      ` Your order contains ${totItems} items and costs $${cost.toFixed(2)}`,
    );
    //set everything back to 0 so that we can start a new order
    setNumItems(Array(item.length).fill(0));
    setShownItem(0);
    setTotItems(0);
    setCost(0);
  }

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 50,
          fontFamily: "Baskerville",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Welcome to Badger Mart!
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {
            //please see note below about TouchableOpacity, changed that section before this one.
        }
        <TouchableOpacity
          style={{
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 8,
            margin: 10,
          }}
          onPress={handlePressPrev}
          disabled={shownItem < 1}
        >
          <Text
            style={{
              color: shownItem < 1 ? "gray" : "blue",
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            Previous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 8,
            margin: 10,
          }}
          onPress={handlePressNext}
          disabled={shownItem > 3}>
          <Text
            style={{
              color: shownItem > 3 ? "gray" : "blue",
              fontSize: 24,
              fontWeight: "bold",
            }}>Next</Text>
        </TouchableOpacity>
      </View>
      {item[shownItem] ? (
        <BadgerSaleItem
          key={item[shownItem].name}
          name={item[shownItem].name}
          price={item[shownItem].price}
          img={item[shownItem].imgSrc}
          upperLimit={upperLimit[shownItem]}
        />) : (<Text>Loading item...</Text>)}
      <View style={{ flexDirection: "row" }}>
        {
          //<Button title="-"  onPress={(handlePressSubtract)} disabled={numItems[shownItem] <= 0}/>
          //<Text style={{margin: 10}}>{numItems[shownItem]}</Text>
          //<Button title="+" onPress={(handlePressAdd)}/>
          //NOTE: CHATGPT QUERY: "How do I design a button in react native for ios, no styling is being applied",
          //ChatGPT said to use TouchableOpacity, gave an example. Then, I used the following website:
          //https://reactnative.dev/docs/touchableopacity
          //Touchable Opacity basically makes a touchable icon or item that you can design, which you can pass a function to,
          //so you can use it as a button. Customized to my liking.
        }
        <TouchableOpacity
          style={{
            backgroundColor: numItems[shownItem] === 0 ? "#f59595" : "red",
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 8,
            margin: 10,
          }}
          onPress={handlePressSubtract}
          disabled={numItems[shownItem] <= 0}>
          <Text style={{ color: "white", fontSize: 24 }}>-</Text>
        </TouchableOpacity>

        <Text style={{ margin: 14, fontSize: 23 }}>{numItems[shownItem]}</Text>
        <TouchableOpacity
          style={{
            backgroundColor:
              numItems[shownItem] >= upperLimit[shownItem]
                ? "#9dd4aa"
                : "green",
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 8,
            margin: 10,
          }}
          onPress={handlePressAdd}
          disabled={numItems[shownItem] >= upperLimit[shownItem]}>
          <Text style={{ color: "white", fontSize: 20 }}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontStyle: "italic", fontSize: 18, fontFamily: "Georgia", marginTop: 30}}>
        You have {totItems} items, costing ${cost.toFixed(2)}
      </Text>
      <TouchableOpacity
          style={{
            backgroundColor: totItems <= 0 ? "#838582": "#80ad6c",
            paddingVertical: 8,
            paddingHorizontal: 18,
            borderRadius: 8,
            margin: 30,
            marginTop: 10
          }}
          onPress={handleSubmit}
          disabled={totItems <= 0}>
          <Text style={{ fontFamily: "sans-serif", fontWeight: "bold", color: "white", fontSize: 24 }}>Place Order</Text>
        </TouchableOpacity>
    </View>
  );
}
