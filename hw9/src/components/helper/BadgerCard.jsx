import { Pressable, StyleSheet, View } from "react-native";

export default function BadgerCard(props) {
    return <Pressable onPress={props.onPress} onLongPress={props.onLongPress}>
        <View style={[styles.card, props.style]}>
            {props.children}
        </View>
    </Pressable>
}

const styles = StyleSheet.create({
    card: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        margin: 5,
        elevation: 5,
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 1,
        backgroundColor: 'white'
    }
})