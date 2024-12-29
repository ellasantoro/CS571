import {StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

function BadgerConversionScreen(props) {
    const handleRegister = () => {
        props.setIsRegistering(true)
    }

    return <View style={styles.container}>
        <Image source={require('../../../assets/title.png')} style={{ width: 355, height: 70, marginTop: -250, marginBottom: 10}}/>

        <Text style={{fontSize: 24}}>Ready to signup?</Text>
        <Text>Join BadgerChat to be able to make posts!</Text>

        <TouchableOpacity onPress={handleRegister}>
        <Image source={require('../../../assets/signup2.png')} style={{ width: 186, height: 42, marginTop: 10}}/>
        </TouchableOpacity>

        <Image source={require('../../../assets/cat4.gif')} style={{ width: 265, height: 250, marginBottom: -100}}/>
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

export default BadgerConversionScreen;