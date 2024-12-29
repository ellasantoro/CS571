import {isLoggedIn, ofRandom} from "../Util";
const createPostSubAgent = (end) => {

    let stage;
    let comment, chatroom, title;
    const CS571_WITAI_ACCESS_TOKEN = "JGRXEUI3D2XBSKQ5S5LJ6DRTZWH22YCJ"; // Put your CLIENT access token here.

    const handleInitialize = async (promptData) => {
        console.log(promptData);
        chatroom = promptData.entities["chatroom:chatroom"] ? promptData.entities["chatroom:chatroom"][0].value : "none";
        console.log(chatroom);
        if(await isLoggedIn()){
            if(chatroom === "none"){
                return end(ofRandom([
                    "You must specify a chatroom to post to.",
                    "Please specify a chatroom to post to when attempting to create a comment",
                    "Before you start creating a post, please specify which chatroom to post to in your command."
                ]))
            }
            stage = "FOLLOWUP_COMMENT";
            return ofRandom([
                "Great! What would you like to title this message",
                "Perfect, please send a title for your message.",
                `Great, I will post your message to the ${chatroom} chatroom. First I will need a title for your post to finalize the process.`,
                `Great, first I need a succinct and captivating title for your message to the ${chatroom} chatroom.`
            ])
        }else{
            return end(ofRandom([
                "You must be logged into create a post",
                "Oh no! You cannot ceate a post before logging in.",
                "Please sign in before attempting to create a message post.",
            ]))
        }
    }

    const handleReceive = async (prompt) => {
        console.log(prompt);
        switch(stage){
            case "FOLLOWUP_COMMENT": return await handleFollowupComment(prompt);
            case "FOLLOWUP_TITLE": return await handleFollowupTitle(prompt);
            case "FOLLOWUP_CONFIRM": return await handleFollowupConfirm(prompt);}}
    const handleFollowupTitle = async(prompt) => {
        comment = prompt;
        stage = "FOLLOWUP_CONFIRM"
        return ofRandom([
            `Great! Type 'confirm' to post your message to ${chatroom} with the title, '${title}'`,
            `Perfect, if you are ready to post this message titled '${title}' in ${chatroom}, type 'confirm'.`,
            `Please type 'confirm' to finalize your post titled '${title}' in ${chatroom}.`,
            `To confirm, you want to create this post titled '${title}' in ${chatroom}?`,
            `Excellent! To confirm, you wish to post your message titled '${title}' to the ${chatroom} chatroom?`
        ])
    }
    
    const handleFollowupComment = async(prompt) => {
        title = prompt;
        stage = "FOLLOWUP_TITLE";
        return ofRandom([
            "Sure, what would you like to comment?",
            "Great! What would you like your post to say?",
            "Excellent! Next, I will need a message for your post.",
            "That's a cool title, what would you like the message to be?",
            "Sounds great! Lastly, I'll need a message for your post!",
            `${title} is a great title! What should the content of the post be?`
        ])
    }

    const handleFollowupConfirm = async(prompt) => {
        if(prompt.toLowerCase().trim() === "confirm" || prompt.toLowerCase().trim() === "yes"){
            await fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw11/messages?chatroom=${chatroom}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    content: comment
                })
            })
            return end(ofRandom([
                {msg: "Successfully posted comment.", nextIsSensitive: false, emote: "SUCCESS"},
                {msg: "Your post was successfully published.", nextIsSensitive: false, emote: "SUCCESS"},
                {msg: "Your post has been made public.", nextIsSensitive: false, emote: "SUCCESS"},
                {msg: "Success! Your post is now public. You can ask to view the most recent messages to view your post.", nextIsSensitive: false, emote: "SUCCESS"},
            ]));
        }else{
            return end(ofRandom([
                {msg: "Your post has been cancelled.", nextIsSensitive: false, emote: "normal"},
                {msg: "You have deleted your post draft.", nextIsSensitive: false, emote: "normal"},
                {msg: "The post has been discarded.", nextIsSensitive: false, emote: "normal"},
                {msg: "You have stopped editing your message, and the post has been discarded.", nextIsSensitive: false, emote: "normal"},
            ]));
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createPostSubAgent;