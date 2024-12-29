import {isLoggedIn, ofRandom} from "../Util";
const createRegisterSubAgent = (end) => {

    let stage;
    let username, password, confirmedPass;

    const handleInitialize = async (promptData) => {
        if(await isLoggedIn()){
            return end(ofRandom([
                {msg:"Whoops! You need to log out before registering for a new account.", emote: "error", nextIsSensitive: false },
                {msg:"You must be logged out to register for a BadgerChat account", emote: "error", nextIsSensitive: false },
                {msg:"Uh oh! You cannot register for a new account while logged in. Please try again after logging out.", emote: "error", nextIsSensitive: false },
            ]))
        }else{
            stage = "FOLLOWUP_REG_USERNAME";
            return ofRandom([
                {msg: "Great! What would you like your username to be?", emote: "normal", nextIsSensitive: false },
                {msg: "Alright, pick a username for your account.", emote: "normal", nextIsSensitive: false },
                {msg: "Excellent! First I will need a username for your new account. ", emote: "normal", nextIsSensitive: false },
            ])
        }
    }


    const handleReceive = async (prompt) => {
        switch(stage){
            case "FOLLOWUP_REG_USERNAME": return await handleFollowUpUsernameReg(prompt); 
            case "FOLLOWUP_REG_PASSWORD": return await handleFollowUpPasswordReg(prompt);
            case "FOLLOWUP_REG_PASSWORD_CONFIRM": return await handleFollowUpConfirmationReg(prompt);
        }
    }

    const handleFollowUpUsernameReg = async(prompt) => {
        username = prompt;
        stage = "FOLLOWUP_REG_PASSWORD";
        return ofRandom([
            {msg: "Great, and what would you like your password to be?", nextIsSensitive: true, emote: "normal"},
            {msg: `${username} is a cool username, now I just need a password to finish up creating your new account! `, nextIsSensitive: true, emote: "normal"},
            {msg: `And what password would you like for your new account, ${username}`, nextIsSensitive: true, emote: "normal"},
            {msg: `Welcome, ${username}. Before you can join the conversation, I'll need a good password for your account.`, nextIsSensitive: true, emote: "normal"},
        ])
        

    }

    const handleFollowUpConfirmationReg = async(prompt) => {
        confirmedPass = prompt;
        if(confirmedPass !== password){
            return end("Pins must match. Please try again. ")
        }

        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw11/register", {
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
                {msg: "Success! You have been registered.", emote: "SUCCESS", nextIsSensitive: false},
                {msg: "You have successfully registered for an account!", emote: "SUCCESS", nextIsSensitive: false},
                {msg: `Welcome to the conversation, ${username}. Your account has been successfully created.`, emote: "SUCCESS", nextIsSensitive: false}
                {msg: `Your account has been successfully created. Welcome to the conversation, ${username}!`, emote: "SUCCESS", nextIsSensitive: false}
            ]))
        }else if(resp.status === 409){
            return  end({msg: "That user already exists!", emote: "error", nextIsSensitive: false});
        }else if(resp.status === 413){
            return end({msg: "'username' must be 64 characters or fewer", emote: "error", nextIsSensitive: false});
        } else{
            /*
            REPLACED W/ 409 & 413 msgs in else ifs, and filtered the 400 issues at the top because
            two different errors map to 400, and when i printed out resp and resp.status there was no 
            field for msg like the API doc says, so I couldn't use that and used this as a work around.
            
            if(resp.status === 409){
                return "That user already exists!";
            }else if(resp.status === 413){
                return "'username' must be 64 characters or fewer.";
            }else if(resp.status === 400){
                return "A request must contain a 'username' and 'pin'.";
            }else{}
                */
            return end(ofRandom([
                {msg: "Sorry, registration was unsuccessful. Please try again ensuring that pins are 7 digits and usernames are 64 characters or fewer.", emote: "error", nextIsSensitive: false},
                {msg:  "Whoops! Something went wrong. Please try again ensuring that pins are 7 digits and usernames are 64 characters or fewer.", emote: "error", nextIsSensitive: false},
                {msg: "I wasn't able to complete your request. Please try again ensuring that pins are 7 digits and usernames are 64 characters or fewer.", emote: "error", nextIsSensitive: false},
            ]))
            
        }
    }

    const handleFollowUpPasswordReg = async(prompt) => {
        password = prompt;
        stage = "FOLLOWUP_REG_PASSWORD_CONFIRM";
        let isnum = /^\d+$/.test(password); //https://stackoverflow.com/questions/1779013/check-if-string-contains-only-digits
        if(!isnum || password.length !== 7){
            return end("Pin must consist only of digits, and must be 7 digits long.");
        }

        return {
            msg: "Please retype your pin to confirm.",
            nextIsSensitive: true,
            emote: "normal"
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createRegisterSubAgent;