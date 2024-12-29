import { Alert, StyleSheet, Text, View, TextInput, Animated,  Keyboard, TouchableWithoutFeedback, TouchableOpacity, Image} from "react-native";
import { useState, useRef} from "react";

function BadgerRegisterScreen(props) {
    const [user, setUser] = useState();
    const [pin, setPin] = useState();
    const [confirmedPin, setConfirmedPin] = useState();
    const slideAnim = useRef(new Animated.Value(-200)).current; 
    const slideAnim2 = useRef(new Animated.Value(-290)).current; 

    Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.timing(slideAnim2, {
        toValue: 0,
        delay: 300,
        duration: 600,
        useNativeDriver: true,
      }).start();

    const handleRegister = () => {
        //some of these are covered in the api docs, but this is an extra level of safety and 
        //alerts nicely without bothering to handle the signup unless we pass these base cases.
        if(!user || !pin || !confirmedPin){
            Alert.alert("Registration Unsuccessful", "Please fill out all fields.");
            return;
        }
        if(user && user.length === 0){
            Alert.alert("Registration Unsuccessful","Username must be more than 0 characters long")
            return;
        }
        //technically will only <=7 b/c we have a maxlength of 7 (there is no minLength option)
        if(pin && pin.length != 7){
            Alert.alert("Registration Unsuccessful","Pin must be 7 digits long")
            return;
        }
        if(pin && confirmedPin && pin !== confirmedPin){
            Alert.alert("Registration Unsuccessful", "Pins must match");
            return;
        }
        props.handleSignup(user, pin);
        props.setIsRegistering(false);
    }
    return (
        //FROM CHATGPT: query was "How do I make it so that if I tap outside of a keyboard/numpad it will
        //exit the keyboard/numpad in react native?" It told me about TouchableWithoutFeedback, which I then
        //used because I wasn't able to hit the sign up or resister buttons because the keyboards were covering it
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
    <Image source={require('../../../assets/title.png')} style={{ width: 355, height: 70, marginTop: 145, marginBottom: 10}}/>
        <Text style={styles.pagetitle}>Join Badger Chat!</Text>

        <Text style={styles.logintexts}>Username</Text>
        <TextInput placeholder={"Enter username"} onChangeText={setUser} autoCapitalize={"none"} autoCorrect={false} style={styles.input}/>

        <Text style={styles.logintexts}>PIN</Text>
        <TextInput placeholder={"Enter PIN"} style={styles.input} keyboardType="numeric" maxLength={7} onChangeText={setPin} autoCapitalize={"none"} autoCorrect={false} secureTextEntry={true}/>
        
        <Text style={styles.logintexts}>Confirm PIN</Text>
        <TextInput placeholder={"Re-enter PIN"} onChangeText={setConfirmedPin} maxLength={7} keyboardType="numeric" style={styles.input} autoCapitalize={"none"} autoCorrect={false} secureTextEntry={true}/>
        <Animated.View style={ { transform: [{ translateX: slideAnim }] }}>
        <TouchableOpacity onPress={handleRegister}>
        <Image source={require('../../../assets/signup2.png')} style={{ width: 186, height: 42, marginTop: 10}}/>
        </TouchableOpacity>
        </Animated.View>
        <Animated.View style={ { transform: [{ translateX: slideAnim2}] }}>
        <TouchableOpacity onPress={() => props.setIsRegistering(false)}>
        <Image source={require('../../../assets/nevermind.png')} style={{ width: 186, height: 42, marginTop: 10}}/>
        </TouchableOpacity>
        </Animated.View>
        <Image source={require('../../../assets/cat2.gif')} style={{ width: 400, height: 200}}/>
    </View>
    </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pagetitle: {
        fontSize: 30,
        fontWeight: "bold",
        paddingBottom: 10,
        padding: 3,
        marginTop: 20
    },
    input: {
        height: 40,
        width: 280,
        textAlign: "center",
        margin: 10,
        borderWidth: 1,
        padding: 5,
        borderRadius: 15
      },
    logintexts: {
        paddingTop: 10,
        fontWeight: "bold",
        fontSize: 18
    }
});

export default BadgerRegisterScreen;