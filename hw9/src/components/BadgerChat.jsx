import { useEffect, useState} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen'
//https://docs.expo.dev/versions/latest/sdk/securestore/

const ChatDrawer = createDrawerNavigator();

export default function App() {
  const [guest, setGuest] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);

  //Load chatrooms by fetching them from the CS571 api, then setChatrooms appropriately.
  useEffect(() => {
    // hmm... maybe I should load the chatroom names here
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/chatrooms", {
      method: "GET",
      headers: {
        "X-CS571-ID": "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6"
      }
      //no credentials - don't need to be logged in to see the types of chatrooms
    }).then(data => data.json()).then(data => {
      setChatrooms(data);
    }).catch(err => {
      alert(`Error: ${err.message}`);
    })
  }, []);

  /**
   * Function that takes in a username and pin from BadgerLoginScreen and checks credentials to ensure
   * user authentication. Uses expo secure store to save a JSON Web Token (JWT), which is valid for 1 hour
   * the token is used to allow a user to create/delete posts.
   * @param {*} username 
   * @param {*} pin 
   */
  function handleLogin(username, pin) {
    // hmm... maybe this is helpful!
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/login", {
      method: "POST", //post as described in api doc
      headers: {
        "X-CS571-ID": "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username, pin}),
      credentials: "include",

    }).then(res => {
      if (res.status !== 200) {
        return res.json().then(errData => {
          console.log("test");
          throw new Error(`Login was unsuccessful: ${errData.msg || res.statusText}`);
        });
      }
      return res.json();
    })
    .then(data => {
      return SecureStore.setItemAsync("JWT", data.token).then(() => {
        //if we could successfully save the JWT, then we have successfully logged in,
        //so we can setIsLoggedIn to true. 
        setIsLoggedIn(true);
      });
    }).catch(err =>  {
      alert(`Error: ${err.message}`);
    });
}

/**
 * A function for handling logout functionality. All we have to do is set the guest status to false and the logged in status to true 
 * (we don't want to be guests OR logged in, we essentially want to go back to a neutral state). Because this function will be called in the
 * BadgerLoginScreen file, we can guarantee that it will be called once a user hits logout, which will then return the JSX at the bottom that
 * will return according to status (i.e. logout status is ensured and the correct JSX will be returned).
 */
const handleLogout = () => {
  setGuest(false);
  setIsLoggedIn(false);
  deleteCredentials(); //delete the JWT
}

/**
 * A function for deleting the JWT from expo secure store; used when logging out.
 */
const deleteCredentials = () => {
    //https://docs.expo.dev/versions/latest/sdk/securestore/
    //https://snyk.io/advisor/npm-package/expo-secure-store/functions/expo-secure-store.deleteItemAsync
    SecureStore.deleteItemAsync("JWT");
}

/**
 * A function for handling signup functionality. We will post to the CS571 API register page and set the JWT token, as we did 
 * in the login functionality (registering a user should also have the same functionality as logging in if successfully registered).
 * @param {*} username 
 * @param {*} pin 
 */
function handleSignup(username, pin) {
  fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/register", {
    //follows API instructions:
    method: "POST",
    headers: {
      "X-CS571-ID": "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6",
      "Content-Type": "application/json"
    },
    //API doc states that we must register the user with the passed in username and pin, the doc also
    //states that an example request body will have the format including "username": username and "password": password,
    //so we can JSON.stringify (turn into JSON string) to pass this as a request.
    body: JSON.stringify({ username, pin }),
    //credentials: "include" <- don't think we need this since they don't need to authenticate a user before letting them register (?)
    credentials: "include"
  })
    .then(res => {
      if (res.status !== 200) {
        return res.json().then(errData => {
          throw new Error(`Registration was unsuccessful: ${errData.msg || res.statusText}`);
        });
      }
      return res.json();
    })
    //we will only get to this part if we successfully registered, so we only attempt to save the JWT AFTER
    //our registration request was approved.
    .then(data => {
      //set the JWT token to the token taken from data. fetching from the register url returns a token
      //in the body if the registration is successful, so we can simply use data.token
      return SecureStore.setItemAsync("JWT", data.token).then(() => {
        //if we can successfully save the token, then we have registered and we can log the user in. it posts
        //the data since we are using the POST method, so this user/pass will be saved!
        setIsLoggedIn(true);
      });
    })
    .catch(err => {
      alert(`Error: ${err.message}`);
    });
}

/**
 * A function for handling guest login attempts. We only have to set the guest status to true and just safely
 * ensure that login status is false. The correct JSX will be outputted because this will be called after clicking
 * login as guest on the home screen.
 */
const handleGuestLogin = () => {
  setGuest(true);
  setIsLoggedIn(false);
}

//different JSX's returned based on status: logged in, registering, or guest
  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} guest={false}/>}
              </ChatDrawer.Screen>

            })
          }
        <ChatDrawer.Screen name="Logout">
          {() => <BadgerLogoutScreen onLogout={handleLogout}/>}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else if(guest === true){
    //copy and pasted from the given code for if(isLoggedIn), but changed to work for guest status (we have the conversion page now)
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} guest={guest} />}
              </ChatDrawer.Screen>

            })
          }
        <ChatDrawer.Screen name="Register">
          {() => <BadgerConversionScreen setIsRegistering={setIsRegistering}/>}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  }
  else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} handleGuestLogin={handleGuestLogin} />
  }
}