import {StyleSheet, Animated, Text, View, TextInput, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity } from "react-native";
import {useState, useRef} from "react";

//show and hide password text: https://www.geeksforgeeks.org/how-to-show-and-hide-password-in-react-native/#:~:text=Use%20the%20SecureTextEntry%20prop%20of,show%20or%20hide%20the%20password.
function BadgerLoginScreen(props) {
    const [user, setUser] = useState();
    const [pin, setPin] = useState();
    const slideAnim = useRef(new Animated.Value(-300)).current; 
    const slideAnim2 = useRef(new Animated.Value(-300)).current; 
    const slideAnim3 = useRef(new Animated.Value(-300)).current; 
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
      Animated.timing(slideAnim3, {
        toValue: 0,
        delay: 700,
        duration: 600,
        useNativeDriver: true,
      }).start();
  
    const userLogin = () => {
        props.handleLogin(user, pin);
    }

    const guestLogin = () => {
        props.handleGuestLogin();
    }

    const handleRegister = () => {
        props.setIsRegistering(true)
        //props.navigation.navigate('src/components/screens/BadgerRegisterScreen.jsx') already navigates in badgerchat
    }
    return (
        //see note in BadgerRegisterScreen on how I learned TouchableWithoutFeedback - this lets you click outside
        //of the keyboards by clicking outside of them
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
        <Image source={require('../../../assets/title.png')} style={{ width: 355, height: 70, marginTop: -100}}/>

        <Text style={styles.logintexts}>Username</Text>
        <TextInput placeholder={"Enter username"} onChangeText={setUser} autoCapitalize={"none"} autoCorrect={false} style={styles.input}/>

        <Text style={styles.logintexts}>Password</Text>
        <TextInput placeholder={"Enter password"} keyboardType="numeric" maxLength={7} style={styles.input} onChangeText={setPin}autoCapitalize={"none"} autoCorrect={false} secureTextEntry={true}/>

        <Animated.View style={{transform: [{translateX: slideAnim}]}}>
        <TouchableOpacity onPress={userLogin}>
        <Image source={require('../../../assets/login.png')} style={{ width: 186, height: 42, marginTop: 10}}/>
        </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{transform: [{translateX: slideAnim2}]}}>
        <TouchableOpacity onPress={handleRegister}>
        <Image source={require('../../../assets/signup.png')} style={{ width: 186, height: 42, marginTop: 10}}/>
        </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{transform: [{translateX: slideAnim3}]}}>
        <TouchableOpacity onPress={guestLogin}>
        <Image source={require('../../../assets/guestlogin.png')} style={{ width: 190, height: 43, marginTop: 10}}/>
        </TouchableOpacity>
        </Animated.View>
        <Image source={require('../../../assets/yarn.gif')} style={{ width: 400, height: 250, marginBottom: -200 }}/>
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
    logintitle: {
        fontFamily: "Baskerville",
        fontSize: 35,
        fontWeight: "bold",
        paddingBottom: 10,
        padding: 3,
        paddingTop: 30
    },
    input: {
        height: 40,
        width: 280,
        textAlign: "center",
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15
      },
    logintexts: {
        paddingTop: 10,
        fontWeight: "bold",
        fontSize: 18,
    }
});

export default BadgerLoginScreen;