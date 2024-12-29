import { StyleSheet, Text, View, Image } from "react-native";

function BadgerLandingScreen(props) {
    return <View style={styles.container}>
        <Image source={require('../../../assets/title.png')} style={{ width: 355, height: 70, marginTop: -280, marginBottom: 140}}/>
        
        <Text style={{fontSize: 24, marginTop: -100}}>Welcome to BadgerChat!</Text>
        <Text>Navigate to a chatroom via the drawer to get started.</Text>

        <Image source={require('../../../assets/cat3.gif')} style={{ width: 700, height: 165, marginBottom: -100}}/>
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

export default BadgerLandingScreen;