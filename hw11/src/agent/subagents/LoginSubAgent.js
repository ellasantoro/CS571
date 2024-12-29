import {isLoggedIn, ofRandom} from "../Util"
const createLoginSubAgent = (end) => {

    let stage;
    let username, password;
    //lots of code taken from ice-voicedev2 across files.
    const handleInitialize = async (promptData) => {
        if(await isLoggedIn()){
            return end(ofRandom([
                {msg: "You are already logged in, try logging out first.", nextIsSensitive: false, emote: "error"},
                {msg: "You are already signed in, try signing out first.", nextIsSensitive: false, emote: "error"},
                {msg: "Please sign out before logging into a new account", nextIsSensitive: false, emote: "error"},
                {msg: "You're already logged in! Ask who am I to identify which account you're logged into, or ask to log out!", nextIsSensitive: true, emote: "error"},
            ]))
        }else {
            stage = "FOLLOWUP_USERNAME";
            return ofRandom([
                {msg: "Sure, what is your username?", nextIsSensitive: false, emote: "normal"},
                {msg: "Alright, what is your username?", nextIsSensitive: false, emote: "normal"},
                {msg: "Great! What is the username of the account you wish to log in to?", nextIsSensitive: false, emote: "normal"},
                {msg: "Perfect, first I will need your username.", nextIsSensitive: false, emote: "normal"},

            ])
        }
    }

    const handleReceive = async (prompt) => {
        switch(stage){
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PASSWORD": return await handleFollowupPassword(prompt);
        }
    }

    const handleFollowupUsername = async(prompt) => {
        username = prompt;
        stage = "FOLLOWUP_PASSWORD";
        return ofRandom([
            {msg: "Great, and what is your password?", nextIsSensitive: true, emote: "normal"},
            {msg: "Thanks, and what is your password?", nextIsSensitive: true, emote: "normal"},
            {msg: "Great! Now I will need your password to finalize your login attempt.", nextIsSensitive: true, emote: "normal"},
            {msg: "Perfect, please enter your password to finish logging in.", nextIsSensitive: true, emote: "normal"}
        ])
    }

    const handleFollowupPassword = async(prompt) => {
        password = prompt;
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                pin: password
            })
        })
        if(resp.status === 200){
            return end(ofRandom([
            {msg: "Successfully logged in!", nextIsSensitive: false, emote: "SUCCESS"},
            {msg: "Success! You have logged in.", nextIsSensitive: false, emote: "SUCCESS"},
            {msg: "You have successfully been logged in!", nextIsSensitive: false, emote: "SUCCESS"},
            {msg: "You have been logged in.", nextIsSensitive: false, emote: "SUCCESS"},
            {msg: "Hooray! Login was successful. what else can I help you with?", nextIsSensitive: false, emote: "SUCCESS"},
            ]))
        }else{
            return end(ofRandom([
                {msg: "Sorry, that username or password is incorrect.", nextIsSensitive: false, emote: "error"},
                {msg: "Sorry, the username or password you entered does not match my records.", nextIsSensitive: false, emote: "error"},
                {msg: "The username or password you entered is not correct. Please try again", nextIsSensitive: false, emote: "error"},
                {msg: "That username or password doesn't match any account. Please try again or register for a new account.", nextIsSensitive: false, emote: "error"}
            ]))
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createLoginSubAgent;