import { StyleSheet, Text, View, FlatList, Modal, TextInput, Button, Alert} from "react-native";
import { useEffect, useState, useContext } from "react";
import BadgerCard from "../helper/BadgerCard";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import CS571 from "@cs571/mobile-client";
import * as SecureStore from "expo-secure-store";
import BadgerGuestStatusContext from "../helper/BadgerGuestStatus";

function BadgerChatroomScreen(props) {
  const [isGuest, setIsGuest] = useContext(BadgerGuestStatusContext);

  const [messages, setMessages] = useState([]); //Holds all messages
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");

  const [loggedUser, setLoggedUser] = useState(undefined);

  function submitPost() {
    //Get token, then send post with token
    SecureStore.getItemAsync("token").then((result) => {
      fetch(
        `https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${props.name}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CS571-ID": CS571.getBadgerId(),
            Authorization: `Bearer ${result}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: postTitle,
            content: postBody,
          }),
        }
      )
        .then((res) => res.json())
        .then((body) => {
          loadMessages();
          setModalVisible(false);
          setPostTitle("");
          setPostBody("");
          Alert.alert("Successfully posted!");
        });
    });
  }

  function deletePost(id) {
    SecureStore.getItemAsync("token").then((result) => {
      //Get token, then send delete request with token
      fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?id=${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
          Authorization: `Bearer ${result}`,
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          Alert.alert("Successfully deleted the post!");
          loadMessages(); //Call load messages to reload the page with message deleted
        } else {
          Alert.alert("Post delete request failed!");
        }
      });
    });
  }

  function loadMessages() {
    setIsLoading(true);
    fetch(
      `https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${props.name}`,
      {
        headers: {
          "X-CS571-ID": CS571.getBadgerId(),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    loadMessages(); //On intial load and whenever screen changes
  }, [props]);

  useEffect(() => {
    //On initial load only, does not run if on guest mode
    if (!isGuest) {
      SecureStore.getItemAsync("username").then((result) => {
        setLoggedUser(result);
      });
    }
  }, []);

  //Determines if isOwned is true, will only put false in if on guest mode
  function determine(renderObj) {
    if (isGuest) {
      return false;
    } else {
      return loggedUser === renderObj.item.poster;
    }
  }

  return (
    <View>
      <FlatList
        data={messages}
        onRefresh={loadMessages}
        refreshing={isLoading}
        keyExtractor={(m) => m.id}
        renderItem={(renderObj) => (
          <BadgerCard>
            <BadgerChatMessage
              post={renderObj.item}
              isOwned={determine(renderObj)}
              deletePost={deletePost}
            />
          </BadgerCard>
        )}
      />

      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.center}>
          <View style={styles.window}>
            <Text style={styles.create}>Create a Post</Text>
            <Text style={styles.enterTextDesc}>Title</Text>
            <TextInput
              value={postTitle}
              onChangeText={setPostTitle}
              style={styles.inputTitle}
            />
            <Text style={styles.enterTextDesc}>Body</Text>
            <TextInput
              value={postBody}
              onChangeText={setPostBody}
              style={styles.inputBody}
              multiline
              autoCapitalize="sentences"
              autoCorrect
            />
            <View style={styles.modalButtons}>
              <Button
                title="Submit"
                onPress={submitPost}
                disabled={postTitle === "" || postBody === ""}
              />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {isGuest ? (
        <></>
      ) : (
        <View style={styles.button}>
          <Button
            title="Add Post"
            color="white"
            onPress={() => setModalVisible(true)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  create: {
    marginBottom: 20,
    fontSize: 30,
    textAlign: "center",
  },
  enterTextDesc: {
    marginBottom: 10,
    fontSize: 20,
  },
  modalButtons: {
    flexDirection: "row",
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderWidth: 2,
    borderColor: "darkred",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 30,
    right: 30,
    height: 70,
    backgroundColor: "red",
    borderRadius: 100,
  },
  window: {
    margin: 20,
    width: "75%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  center: {
    flex: 1,
    top: 100,
    alignItems: "center",
  },
  inputTitle: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  inputBody: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    minHeight: 100,
  },
});

export default BadgerChatroomScreen;
