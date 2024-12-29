import { Text, TouchableOpacity, Image } from "react-native";
import BadgerCard from "./BadgerCard"

function BadgerChatMessage(props) {
    const dt = new Date(props.created);
    const{id, ownership, handleDelete} = props;  //allows us to use fields from BadgerChatScreen in this file (and allows us to use delte functionality)

    return (
        <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
            <Text style={{ fontSize: 32, fontWeight: '600', fontFamily:"Baskerville" }}>{props.title}</Text>
            <Text style={{ fontSize: 12, fontStyle: "italic", color: "#355f89", marginBottom: 20 }}>
                By {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}
            </Text>
            <Text style={{fontSize: 17, marginTop: -10}}>{props.content}</Text>
            {
            ownership === true && (
            <TouchableOpacity onPress={() => handleDelete(id)}>
            <Image source={require('../../../assets/deletepost.png')} style={{ width: 135, height: 35, marginTop: 30, marginBottom: -10, marginLeft: -10}}/>
            </TouchableOpacity>
            )}
        </BadgerCard>
    );
}

export default BadgerChatMessage;
