import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {StyleSheet, Button, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerGuestStatusContext from './helper/BadgerGuestStatus';
import BadgerConversionScreen from './screens/BadgerConversionScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false) //Login status
  const [isRegistering, setIsRegistering] = useState(false); //Registration status
  const [chatrooms, setChatrooms] = useState([]); //List of chatrooms
  const [isGuest, setIsGuest] = useState(false); //Whether guest mode is on or not


  //Initial load
  useEffect(() => {
    // hmm... maybe I should load the chatroom names here
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/chatrooms", {
      method: "GET",
      credentials: "include",
      headers:{
          "X-CS571-ID": CS571.getBadgerId(),
      }
    })
    .then(res => res.json())
    .then(body => {
      setChatrooms(body);
    }
    ).catch(error => {
      console.log("Error fetching chatrooms:", error.message);
    })

  }, []);

  function handleLogin(username, pin) {

    //Catch any errors with sign up before fetch, shouldn't come to this but just in case.....

    if (username === "" || pin === ""){
      Alert.alert("Please enter a username and PIN!");
      return;
    }

    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/login", {
      method: "POST",
      credentials: "include",
      headers:{
          "X-CS571-ID": CS571.getBadgerId(),
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          username: username,
          pin: pin
      })
  }).then(res => {

    if (res.status === 401){
      Alert.alert("Incorrect Login", "Please try again.");
      return res.json();
    } 

    if (res.status === 200){
      return res.json();
      }
    
  }).then(body => {

    //If body was returned with user field, means registration was success

    if (body.user){
    SecureStore.setItemAsync("token", body.token);
    SecureStore.setItemAsync("username", body.user.username).then(() => {
      Alert.alert("Login Successful", "Success!");
      setIsLoggedIn(true);
    });

    }
  }).catch(error => {
    console.log("Error during login: ", error.message);
  })
  }

  function handleSignup(username, pin, repeatPin) {

    //Catch any errors with sign up before fetch, shouldn't come to this but just in case.....

    if (pin === "" || username === "" || repeatPin === ""){
      Alert.alert("Please enter a username and pin!");
      return;
    }

    if (pin !== repeatPin){
      return;
    }

    if (pin.length !== 7){
      return;
    }
  
    //If all is well, do fetch
    fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/register", {
      method: "POST",
      credentials: "include",
      headers:{
          "X-CS571-ID": CS571.getBadgerId(),
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          username: username,
          pin: pin
      })
  }).then(res => {
    if (res.status === 409){
      Alert.alert("Signup Failed!", "This account already exists!");
      return res.json();
    } 

    if (res.status === 200){
      return res.json();
    }

  }).then(body => {

    //If body was returned with user field, means registration was success

    if (body.user) {
      SecureStore.setItemAsync("token", body.token);
      SecureStore.setItemAsync("username", body.user.username).then(() => {
        Alert.alert("Signup Successful", "Success!");
        setIsLoggedIn(true);
      });
    }
  }).catch(error => {
    console.log("Error during sign up: ", error.message);
  })
  }

  function handleLogout(){
    SecureStore.deleteItemAsync("username");
    SecureStore.deleteItemAsync("token").then(() => {
      setIsLoggedIn(false);
      setIsRegistering(false);
      Alert.alert("Logged Out", "Successfully logged out!");
    })
  }

  function handleConversion(){
    setIsRegistering(true);
    setIsGuest(false);
  }

  if (isLoggedIn || isGuest) {
    return (
      <BadgerGuestStatusContext.Provider value={[isGuest, setIsGuest]}>
        <NavigationContainer>
          <ChatDrawer.Navigator>
            <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
            {chatrooms.map((chatroom) => {
              return (
                <ChatDrawer.Screen key={chatroom} name={chatroom}>
                  {(props) => <BadgerChatroomScreen name={chatroom} />}
                </ChatDrawer.Screen>
              );
            })}
            {isGuest ? (
              <ChatDrawer.Screen name="Signup">
                {() => (
                  <BadgerConversionScreen handleConversion={handleConversion} />
                )}
              </ChatDrawer.Screen>
            ) : (
              <ChatDrawer.Screen name="Logout">
                {() => <BadgerLogoutScreen handleLogout={handleLogout} />}
              </ChatDrawer.Screen>
            )}
          </ChatDrawer.Navigator>
        </NavigationContainer>
      </BadgerGuestStatusContext.Provider>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsGuest={setIsGuest} setIsRegistering={setIsRegistering} />
  }
}