const { axiosInstance } = require("./axios");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { geminiToken } = require('../../config.json')

async function gemini(input){
    const genAI = new GoogleGenerativeAI(geminiToken);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = input;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    return response;
    
}

function sendMessage(messageObj, messageText){
    return axiosInstance.get("sendMessage", {
        chat_id: messageObj.chat.id,
        text: messageText,
    });
}

async function handleMessage(messageObj){
    const messageText = messageObj.text || "";
    
    if (messageText.charAt(0) == "/"){
        const command = messageText.substr(1);
        //split
        const i = command.split(" ");
        if (i[0]=="gemini"){
            let input = command.substr(6);
            let output = await gemini(input);
            return sendMessage(
                messageObj,
                `
				${output}
				`);
        }
        switch (command){
            case "start":
                return sendMessage(
                	messageObj,
                	`
                    this is bot created by <b>zain<b> for personal purpose
                    `
                );
            default:
                return ;
        }     
		
    } else {
        return sendMessage(messageObj, messageText);
    }
}

module.exports = { handleMessage }


