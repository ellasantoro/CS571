import { Text, View, Image } from "react-native";

//USAGE NOTE: Some code is taken from ICE mobile web dev 1. 
export default function BadgerSaleItem(props) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      {props.img ? (
        <Image source={{ uri: props.img }} style={{ width: 300, height: 300 }}/>) : (<></>)}
      <Text
        style={{
          fontWeight: "bold",
          fontSize: "25em",
          fontFamily: "Baskerville",
          marginTop: -30
        }}>
        {props.name}
      </Text>
      {
        //gave the following line to chatGPT: <Text style={{fontStyle: 'italic'}}>${props.price}</Text>,
        //and asked it to help me make it so that if there is only one decimal place it adds a 0 to the end,
        //as I couldn't get it to work on my own. This way instead of $1.5 it will say $1.50, but if it says $1.75
        //it wont cut off the 5, and it wont add a trailing 0: 1.750.
      }
      <Text style={{fontStyle: "italic", marginTop: 5, marginBottom: 10}}> You can order up to {props.upperLimit} {props.name === "Eggs" ? props.name : props.name + "s"}</Text>
      <Text style={{ fontStyle: "italic", fontSize: "20em", marginBottom: 10}}>
        ${parseFloat(props.price).toFixed(2)}
      </Text>
    </View>
  );
}
