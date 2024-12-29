import {StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

function BadgerLogoutScreen(props) {
const{onLogout} = props; //allows for us to call the logout function in BadgerChat in this file.

    return <View style={styles.container}>
        <Image source={require('../../../assets/title.png')} style={{ width: 355, height: 70, marginTop: -250, marginBottom: 140}}/>
        <Text style={{fontSize: 24, marginTop: -100, marginBottom: 5, fontWeight: "bold"}}>Are you sure you're done?</Text>
        <Text>Come back soon!</Text>
        <Text/>
        <TouchableOpacity onPress={() => onLogout()}>
        <Image source={require('../../../assets/logout.png')} style={{ width: 190, height: 43, marginTop: 10, marginBottom: 40}}/>
        </TouchableOpacity>
        <Image source={require('../../../assets/cat5.gif')} style={{ width: 400, height: 185, marginBottom: -180}}/>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default BadgerLogoutScreen;