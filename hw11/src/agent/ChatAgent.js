import { VscNewline } from "react-icons/vsc";
import createChatDelegator from "./ChatDelegator";
import {ofRandom, isLoggedIn, getLoggedInUsername} from "./Util";

const createChatAgent = () => {
    const CS571_WITAI_ACCESS_TOKEN = "JGRXEUI3D2XBSKQ5S5LJ6DRTZWH22YCJ"; // Put your CLIENT access token here.

    const delegator = createChatDelegator();

    let chatrooms = [];

    const handleInitialize = async () => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/chatrooms", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        });
        const data = await resp.json();
        console.log(data);
        chatrooms = data;

        return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
    }

    const handleReceive = async (prompt) => {
        if (delegator.hasDelegate()) { return delegator.handleDelegation(prompt); }
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0) {
            switch (data.intents[0].name) {
                case "get_help": return handleGetHelp();
                case "get_chatrooms": return handleGetChatrooms();
                case "get_messages": return handleGetMessages(data);
                case "login": return handleLogin();
                case "register": return handleRegister();
                case "create_message": return handleCreateMessage(data);
                case "logout": return handleLogout();
                case "whoami": return handleWhoAmI();
            }
        }
        return ofRandom([
            "Sorry, I didn't get that. Type 'help' to see what you can do!",
            "I didn't catch that! Please try again or type 'help' to see what you can do!",
            "I'm not sure I understand your request. Try typing 'help' to see what you can do!"
        ])
    }

    const handleGetHelp = async () => {
        return ofRandom([
            "Try asking 'give me a list of chatrooms', or ask for more help!",
            "Try asking 'register for an account', or ask for more help!",
            "Try asking 'post a message', or ask for more help!",
            "Try asking 'give me the 4 latest posts', or ask for more help!",
            "Try asking 'log into an account', or ask for more help!",
        ])
    }

    const handleGetChatrooms = async () => {
        let str = "The available chatrooms are: ";
        chatrooms.map((room, index) => {
            if(index === chatrooms.length-1){
                str += "and " + room + ".";
            }else{
                str += room + ", ";
            }
        })
        return str;
    }

    //TODO: add chatroom in which the message is posted to
    const handleGetMessages = async (data) => {
        console.log(data);
        const quantity = data.entities["wit$number:number"] ? Math.floor(data.entities["wit$number:number"][0].value) : 1;
        const targetRoom = data.entities["chatroom:chatroom"] ? data.entities["chatroom:chatroom"][0].value : "all";
        let msgData;
            //TODO: check that the targetRoom equals an existing chatroom. 
        if(targetRoom !== "all"){
            const resp = await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?chatroom=${targetRoom}&num=${quantity}`, {
            method: "GET",
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        });
        msgData = await resp.json();
        }else{
            const resp = await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?num=${quantity}`, {
                method: "GET",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId()
                }
            });
            msgData = await resp.json();
        }
        const msgs = msgData.messages;
        let strArr = [];
        msgs.map((msg, index) => {
            strArr[index] = printMessage(msg);
        })
        return strArr;
    }

    const printMessage = (msg) => {
        return `${msg.title} | ${msg.content} | Posted by: ${msg.poster}`;
    }

    const handleLogin = async () => {
        return await delegator.beginDelegation("LOGIN");
    }

    const handleRegister = async () => {
        return await delegator.beginDelegation("REGISTER");
    }

    const handleCreateMessage = async (data) => {
        return await delegator.beginDelegation("CREATE", data);
    }

    const handleLogout = async () => {
        if(await isLoggedIn()){
            const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                }

            });
            if(resp.status === 200){
                return ofRandom([
                    "You have been logged out.",
                    "You have successfully signed out!",
                    "Success! You're logged out.",
                    "Success! You've been signed out!",
                    //TODO: add more
                ])
            }else{
                return ofRandom([
                    "Logout was unsuccessful",
                    "Failed to sign out",
                    "Oh no! The logout was unsuccessful. Please try again.",
                    "Whoops, something went wrong. You have not been signed out, please try again.",
                    "The sign-out attempt was unsuccessful, please try again."
                ])
            }
        }else{
            return ofRandom([
                "You must be logged in to log out.",
                "You are not logged in.",
                "You cannot log out while in guest mode.",
                "Logout was unsuccessful, you are not signed in!",
                "Please sign in before attempting to log out.",
            ])
        }
    }

    const handleWhoAmI = async () => {
        if(await isLoggedIn()){
            const name = await getLoggedInUsername();
            return `You are logged in as ${name}`
        }else{
            return ofRandom([
                "You are not signed in.",
                "You are not currently logged in.",
                "You are not logged into any account",
                "Please sign in before requesting this function."
            ])
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;