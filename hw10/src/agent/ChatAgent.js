const createChatAgent = () => {

    const CS571_WITAI_ACCESS_TOKEN = "2WMQKNTXOR7A7ACFZ6XGLSTMYVT4ND3P"; // Put your CLIENT access token here.

    //variables used throughout file - list of available items and list of items in cart
    let availableItems = [];
    let cart = []; 

    /**
     * Function for intializing the chat agent - gives a welcome message and initializes the cart and the
     * available items for purchase. 
     * 
     * @returns help message
     */
    const handleInitialize = async () => {
        getItems();
        return "Welcome to BadgerMart Voice! :) Type your question, or ask for help if you're lost!"
    }

    /**
     * The main function for receiving input and handling the task by delegating it based on the identified intents 
     * in wit.AI. It calls the appropriate functions to deal with specific tasks, and returns a fallback message if
     * no intents are identified.
     * 
     * @param {*} prompt 
     * @returns response message to a user input
     */
    const handleReceive = async (prompt) => {
        // TODO: Replace this with your code to handle a user's message!
        //note: lots of things taken from and adapted or inspired by ice-voicedev1
        const res = await fetch("https://api.wit.ai/message?q=" + encodeURIComponent(prompt), {
            headers: {
                "Authorization": "Bearer " + CS571_WITAI_ACCESS_TOKEN
            }
        })
        const data = await res.json();
        console.log(data);
        if(data.intents.length > 0){
            //options for the user's input to map to (intents in witAI)
            switch(data.intents[0].name){
                case "get_help": return getHelp();
                case "get_items": return listItems();
                case "get_price": return getPrice(data);
                case "add_item": return addItems(data);
                case "remove_item": return removeItems(data);
                case "view_cart": {
                    if(getTotal() === `$0.00`){
                        return "You have no items in your cart."
                    }else{
                        return viewCart();
                    }
                }
                case "checkout": {
                    if(getTotal() === `$0.00`){
                        return "You have no items to checkout."
                    }else{
                        return checkoutItems();
                    } 
                } 
            }
        }else{
            return "Sorry, I didn't get that. Type 'help' to see what you can do!"
        }
        //we should never reach the following message
        return "Your message has been received. Maybe I should contact Wit.AI to figure out what you intend..."
    }

    /**
     * Function to fetch items from the cs571 API and populate the array for the cart (to contain all the proper fields),
     * as well as the array for the available items.
     */
    const getItems = async () => {
        const res = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw10/items", {
            headers: {
                "X-CS571-ID": "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6"
            }
        });
        availableItems = await res.json();
        availableItems.forEach((item) => {
            cart.push({
                name: item.name,
                price: item.price,
                quantity: 0,
            });
        });
    }
    
    /**
     * Function to return the help menu message
     * 
     * @returns help message
     */
    const getHelp = async() => {
        return "In BadgerMart Voice, you can get the list of items, the price of an item, add or remove an item from your cart, and checkout!"
    }
    
    /**
     * Returns the list of items for sale using the global availableItems variable as a string
     * 
     * @returns the list of items for sale
     */
    const listItems = async () => {
        let str = "We have ";
        availableItems.map((item, index) => {
            if (index === availableItems.length - 1) {
                str += "and " + item.name.toLowerCase() + "s";
            } else {
                str += item.name.toLowerCase() + "s, ";
            }
        })
        return str + " for sale!"
    }

    /**
     * Takes the user input and finds the entities fields, returning the prie of the specific item
     * for sale. If there is no item_type entity (no item mapping), then it will return an out of
     * stock message
     * 
     * @param {*} data 
     * @returns the price of a given item
     */
    const getPrice = async(data) => {
        if(data.entities["item:item_type"]){
            switch(data.entities["item:item_type"][0].value){
                case "apple": return `Apples cost ${itemPrice("apple")} each.`;
                case "bagel": return `Bagels cost ${itemPrice("bagel")} each.`;
                case "coconut": return `Coconuts cost ${itemPrice("coconut")} each.`;
                case "donut": return `Donuts cost ${itemPrice("donut")} each.`;
                case "egg": return `Eggs cost ${itemPrice("egg")} each.`;
                default: return "I'm not sure we have that item. Please try again."
            }
        }else{
            return "We do not have that item in stock. Please try again."
        }
    }

    /**
     * Function for checking out the items by posting a request to the API containing
     * items and their quantities. Resets the cart if successful check out.
     * 
     * @returns 
     */
    const checkoutItems = async() => {
        const resp = await fetch("https://cs571api.cs.wisc.edu/rest/f24/hw10/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_9c50525a849c91aa6beb9e5fb48d0c346bf3fb11cf8c4828c67ace062a69cfd6"
            },
            body: JSON.stringify(getCartBody())
        });
        const data = await resp.json(); //from ice-voicedev1
        if(resp.status === 200){
            cart = [];
            getItems();

            return "Success! Your confirmation ID is " + data.confirmationId
        }else{
            return "Your purchase was unsuccessful.";
        }
    }
    
    const viewCart = async() => {
        let viewCartStr = "Your cart currently contains ";
        let total = getTotal();
        if(total === 0){
            return "You have no items in your cart."
        }
        let cartItems = cart.filter((item => item.quantity >= 1));
        cartItems.map((item, index) => {
            if(item.quantity === 1 && index === cartItems.length - 2){
                viewCartStr = viewCartStr + item.quantity + " " + item.name.toLowerCase() + ", and "
            }else if(item.quantity !== 1 && index === cartItems.length - 2){
                viewCartStr = viewCartStr + item.quantity + " " + item.name.toLowerCase() + "s, and "
            }else if(item.quantity === 1 && index != cartItems.length - 2){
                viewCartStr = viewCartStr + item.quantity + " " + item.name.toLowerCase() + ", "
            }else{
                viewCartStr = viewCartStr + item.quantity + " " + item.name.toLowerCase() + "s, "
            }
            
        })
        return viewCartStr + " totaling " + total;

    }

    /**
     * Function for adding item to the cart by identifying an item and a number from the user's input.
     * Updates the cart variable to ensure we can use it when viewing the cart and checking out. 
     * 
     * @param {*} data 
     * @returns confirmation or error message for adding items to cart
     */
    const addItems = async(data) => {
        const quantity = data.entities["wit$number:number"] ? Math.floor(data.entities["wit$number:number"][0].value) : 1;
        if (quantity <= 0) {
            return "Please request at least 1 item when adding to your cart.";
        }
    
        if (data.entities["item:item_type"]) {
            const itemName = data.entities["item:item_type"][0].value;
            const item = findItemInCart(itemName);
            console.log(item);
            if(!item){
                return "We do not have that item in stock.";
            }
    
            item.quantity += quantity;
            return `Sure, adding ${quantity} ${item.name.toLowerCase()}s to your cart.`;
        }
    
        return "Item is not in stock.";
    }
    /**
     * Helper method for removing the items from the cart
     * 
     * @param {*} data 
     * @returns an error or confirmation message for removing items from the cart
     */
    const removeItemFromCart = (item, quantity) => {
        if (!item) return null;
    
        if (item.quantity === 0) return `You do not have any ${item.name.toLowerCase()}s in your cart.`;
    
        if (item.quantity - quantity < 0) {
            item.quantity = 0;
            return `Sure, removing all ${item.name.toLowerCase()}s from your cart.`;
        } else {
            item.quantity -= quantity;
            return `Sure, removing ${quantity} ${item.name.toLowerCase()}s from your cart.`;
        }
    };

    /**
     * Function for removing items from the cart using an item type and a quantity from the user's
     * input.
     * 
     * @param {*} item 
     * @param {*} quantity 
     * @returns an error or confirmation message for removing items from the cart
     */
    const removeItems = async (data) => {
        const quantity = data.entities["wit$number:number"] ? Math.floor(data.entities["wit$number:number"][0].value) : 1;
        if (quantity <= 0) {
            return "Please request at least 1 item when removing from cart.";
        }
    
        if (data.entities["item:item_type"][0]) {
            const itemName = data.entities["item:item_type"][0].value;
            const item = findItemInCart(itemName);
            const result = removeItemFromCart(item, quantity);
            if (result) {
                return result;
            } else {
                return `You do not have any ${itemName.toLowerCase()}s in your cart.`;
            }
        }
    
        return "Please specify an item to remove.";
    };

    //HELPER FUNCTIONS FOR MAIN FUNCTIONS:

    const getCartBody = () => {
        const body = {};
        cart.forEach(item => {
            const formattedName = item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase();
            body[formattedName] = item.quantity;
        });
        console.log(body);
        return body;
    }


    const findItemInCart = (itemName) => {
        return cart.find(item => item.name.toLowerCase() === itemName.toLowerCase());
    };

    const getTotal = () => {
        let price = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return `$${price.toFixed(2)}`;

    }

    const itemPrice = (target) => {
       let price = availableItems.find(item => item.name.toLowerCase() === target).price
       return `$${price.toFixed(2)}`;
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;