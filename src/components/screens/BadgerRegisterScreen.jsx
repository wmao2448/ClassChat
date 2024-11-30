import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";

function BadgerRegisterScreen(props) {

    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [repeatPin, setRepeatPin] = useState("");



    function warningMessage() {
        //PIN is missing
        if (pin === ""){
            return <Text style={styles.warning}>Please Enter a PIN</Text>
        }

        //PINs do not match
        if (pin !== repeatPin){
          return <Text style={styles.warning}>PINs do not match!</Text>
      }

        //PINs match but are not 7 digits long
        if (pin.length !== 7) {
            return <Text style={styles.warning}>A PIN must be 7 digits</Text>
        }
    

    }
    return (
      <View style={styles.container}>
        <View style={styles.items}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
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
        <Text>Confirm PIN</Text>
        <TextInput
          style={styles.input}
          value={repeatPin}
          onChangeText={setRepeatPin}
          keyboardType="number-pad"
          maxLength={7}
          secureTextEntry={true}
        />


        {warningMessage()}
        <View style={styles.buttonContainer}>
        <Button
          color="crimson"
          title="Signup"
          onPress={() => props.handleSignup(username, pin, repeatPin)}
          disabled={pin === "" || username === "" || repeatPin === "" || pin.length !== 7 || pin !== repeatPin}
        />

        <Button
          color="grey"
          title="Nevermind!"
          onPress={() => props.setIsRegistering(false)}
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
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: "50%"
      },
    warning: {
      color:"red"
    },
    items: {
        marginTop: 150,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        width: "100%",
    }
});

export default BadgerRegisterScreen;