import { Text, TouchableOpacity, StyleSheet } from "react-native";
import BadgerCard from "./BadgerCard"

function BadgerChatMessage({post, isOwned, deletePost}) {

    const dt = new Date(post.created);
    // console.log(props);
    return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
        <Text style={{fontSize: 28, fontWeight: 600}}>{post.title}</Text>
        <Text style={{fontSize: 12}}>by {post.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text>{post.content}</Text>
        {isOwned ? <TouchableOpacity style={styles.delete} onPress={()=>deletePost(post.id)}>
            <Text style={styles.deleteText}> Delete Post </Text>
        </TouchableOpacity> : <></>}
    </BadgerCard>
}

const styles = StyleSheet.create({
    delete: {
        marginTop: 10,
        backgroundColor: "red",
        borderRadius: 10,
    },
    deleteText: {
        textAlign:"center",
        color: "white",
        fontSize: 18,
    }
})

export default BadgerChatMessage;