import { StyleSheet, TouchableOpacity, Image, Text, FlatList, View, SafeAreaView, Modal, TextInput, Button, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useState, useEffect } from "react";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import * as SecureStore from "expo-secure-store";

function BadgerChatroomScreen(props) {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [post, setPost] = useState('');
    const [messages, setMessages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisibility, setModalVisibility] = useState(false);

    //get messages (ensure props.name is a dependency since we use that in our getMessages function)
    useEffect(() => {
      getMessages();
    }, [props.name]);

    //get the user (for knowing if we can delete a message) but only call getUser if the props is not a guest
    useEffect(() => {
      if (!props.guest) {
        getUser();
      }
    });

    /**
     * A function for grabbing the user that is logged in (will only get called if not a guest). 
     */
    const getUser = () => {
      //see note about getCredentials().then(token => ) below in getMessages()
      getCredentials().then((token) => {
        fetch("https://cs571api.cs.wisc.edu/rest/f24/hw9/whoami", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CS571-ID": "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6",
          },
        })
          .then((data) => data.json())
          .then((data) => {
            setUser(data.user.username);
          })
          .catch((error) => {
            alert(`Error: ${error.message}`);
          });
      });
    };

    /**
     * A function for grabbing the message using a GET fetch and a JWT token
     */
    const getMessages = () => {
        setRefreshing(true); 
        //ChatGPT usage note: Gave ChatGPT access to getCredentials() funciton and getMessages() function (redacted links),
        //and asked how to use the JWT I get in getCredentials to use it for Authorization: Bearer: token (as the API states).
        //It told me to do getCredentials.then(token => ....). Please note that everything inside of that line is not influenced by GPT.
        getCredentials().then(token => {
            fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${props.name}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-CS571-ID": "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6"
                }
            })
            .then(response => response.json())
            .then(data => {
                setMessages(data.messages);
                setRefreshing(false);
            })
            .catch(error => {
                console.error("Error:", error);
                setRefreshing(false);
            });
        });
    };

    const createPost = () => {
        //see note about token  above in getMessages()
        getCredentials().then(token => {
            fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?chatroom=${props.name}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-CS571-ID": "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6",
                    "Content-Type": "application/json"
                },
                //include a title and post in the request body as mentioned in API
                body: JSON.stringify({ title: title, content: post })
            })
            .then(response => response.json())
            .then(data => {
                if (data.msg === "Successfully posted message!") {
                    //clear the post details, we don't want to see them if we create a post next time
                    setTitle('');
                    setPost('');
                    getMessages(); //refresh the messages every time we change something (we want to see the new post)
                    setModalVisibility(false);
                    Alert.alert("Success", "Your post has been created!");
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
        });
    };

    const handleDelete = (id) => {
        getCredentials().then(token => {
            fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw9/messages?id=${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-CS571-ID": "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6",
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.msg === "Successfully deleted message!") {
                    Alert.alert("Success", "Your post has been deleted.");
                    getMessages(); // Refresh the messages
                } else {
                    Alert.alert("Error", "There was an issue deleting your post.");
                }
            })
            .catch(error => {
                console.error("Error deleting message:", error);
                Alert.alert("Error", "Something went wrong. Please try again.");
            });
        });
    }
    const deletePost = (id) => {
        //received help from google AI: I searched "how to make a confirmation delete alert in react native",
        //and their AI gave me the settings to use in Alert.alert.
        Alert.alert("Confirm Deletion", "Are you sure you want to remove your message? This action cannot be undone.", [{
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => handleDelete(id)
                }
            ],
            { cancelable: true }
        );
    };

    async function getCredentials() {
        //https://docs.expo.dev/versions/latest/sdk/securestore/
        try{
        return await SecureStore.getItemAsync("JWT");
        }catch(err){
            alert(`Error: ${err.message}`);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <BadgerChatMessage
                        id={item.id} 
                        title={item.title} 
                        content={item.content}
                        poster={item.poster}
                        created={item.created}
                        handleDelete={deletePost}
                        ownership={item.poster === user}
                    />)}
                refreshing={refreshing}
                onRefresh={getMessages}
                ListEmptyComponent={<Text>There are no messages in this chatroom!</Text>}
            />
            {!props.guest && (
            <TouchableOpacity style={{alignItems: "center"}} onPress={() => setModalVisibility(true)}>
            <Image source={require('../../../assets/post.png')} style={{ width: 190, height: 43, marginTop: 10}}/>
            </TouchableOpacity>   
            )}
            {!props.guest && (
                <Modal visible={modalVisibility} onRequestClose={() => setModalVisibility(false)} animationType="slide" style={{backgroundColor: "white"}}>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={styles.modalContainer}>
                            <Image source={require('../../../assets/posttitle.png')} style={{ width: 350, height: 40, marginTop: 5, marginBottom: 10}}/>
                            <Text style={{fontSize: 20, fontWeight: "bold"}}>Post Details:</Text>
                            <TextInput style={styles.input} placeholder="A creative, eye-catching title" placeholderTextColor="gray" value={title} onChangeText={setTitle}/>
                            <TextInput style={[styles.input, styles.textArea]} placeholder="A riveting post filled with groundbreaking ideas..." placeholderTextColor="gray" value={post} onChangeText={setPost} multiline={true}/>

                            <View style={styles.modalButtons}>
                                <Button title="Cancel" onPress={() => setModalVisibility(false)} />
                                <Button title="Create Post" onPress={createPost} disabled={!title || !post}/>
                            </View>
                            <Image source={require('../../../assets/cat6.gif')} style={{ width: 190, height: 200, marginBottom: -265, marginTop: 100}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,

    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    textArea: {
        height: 100,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        marginTop: 20,
    }
});

export default BadgerChatroomScreen;
