import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";

function BadgerLoginScreen(props) {

    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");

    return (
      <View style={styles.container}>
        <View style={styles.items}>
          <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
          <Text>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Text>PIN</Text>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={7}
            secureTextEntry={true}
          />
          <Button
            color="crimson"
            title="Login"
            onPress={() => {
              props.handleLogin(username, pin); //handleLogin is in BadgerChat
            }}
          
          />
          <Text style={{margin:10}}>New Here?</Text>
          <View style={styles.buttonContainer}>
          <Button
            color="grey"
            title="Signup"
            onPress={() => props.setIsRegistering(true)}
          />
          {/* {insert funciton here that determines which message will be displayed} */}
          <Button
            color="darkgrey"
            title="Continue as Guest"
            onPress={() => props.setIsGuest(true)}
          />
          </View>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  buttonContainer:{
    flexDirection:"row",
    margin: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",

  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "50%",
  },
  items: {
    marginTop: 150,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
}
});

export default BadgerLoginScreen;