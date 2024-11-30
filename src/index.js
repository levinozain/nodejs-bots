require('dotenv').config();
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { clientId, guildId, token, geminiToken, tokenNgrok } = require('./config.json');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			bot.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

bot.on(Events.InteractionCreate, interaction => {
	console.log(interaction);
});


bot.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

bot.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.bot.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

bot.login(token);

async function whatsapp() {
    const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
	const qrcode = require('qrcode-terminal');
 
	const wwebVersion = '2.2407.3';

	const client = new Client({
        authStrategy: new LocalAuth(), // your authstrategy here
        puppeteer: {
          headless: true , args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        webVersionCache: {
            type: 'remote',
            remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
        },
    });
 
	client.on('qr', qr => {
    	qrcode.generate(qr, {small: true});
    	});
 
	client.on('ready', () => {
    	console.log('Client is ready!');
	});
 
	const prefix = "!";
 
	client.on('message', async msg => {
 
    	if (msg.body[0] == prefix){
        
        	var [cmd, ...args] = msg.body.slice(1).split(" ");
        	args = args.join(" ");
 
        	if (cmd == "ping"){
            	client.sendMessage(msg.from, "pong");
        	}
        
        	if (cmd === "s") {
            	const attachmentData = await msg.downloadMedia();
            	client.sendMessage(msg.from, attachmentData, {sendMediaAsSticker: true});
           	}
 
        	if (cmd === "help") {
                client.sendMessage(msg.from, "**Commands** \n !s - convert images to sticker");
        	}
            
            if (cmd === "gemini"){
                const genAI = new GoogleGenerativeAI(geminiToken);
        		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        		let input = args;

        		const prompt = input;

        		const result = await model.generateContent(prompt);
        		const response = await result.response.text();
                
                client.sendMessage(msg.from, response);
            }
 
    	}
        
	});
 
	client.initialize();
}

whatsapp();

const express = require("express");
const PORT = 25568;
const { handler } = require("./controller");

const app = express();
app.use(express.json());
app.post("*", async (req,res) => {
    console.log(req.body);
    
    res.send(await handler(req));
});
app.get("*", async (req,res) => {
    res.send(await handler(req));
});

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

const http = require('http');
const ngrok = require('@ngrok/ngrok');

const setupWebhook = async (link) => {
    try {
        const { data } = await axios.get(`https://api.telegram.org/bot6842610635:AAFcwy6S4AVxZvKf3T2IKXEEtBB-2564kDo/setWebhook?url=${link}`)
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}

// Get your endpoint online
ngrok.connect({ addr: 25568, authtoken: tokenNgrok})
    .then( listener => setupWebhook(listener.url()));
    
    //.then(listener => setupWebhook(`${listener.url()}`));
//console.log(`Ingress established at: ${listener.url()}`);

// REST API
function restapi(){
	const express = require("express")
	const { MongoClient } = require('mongodb')
	const mongodb = require('./dbconnect/mongodb.js')

	const app = express()
	app.use(express.json())

	PORT = 19136

	app.get('/',(req, res) =>{
    	res.send(
			{
				'status': "ok"
        	}
    	)
	})

	app.get('/api/apod', async(req, res) =>{
    	try{
        	const data = await mongodb.coll.find({}).toArray()
        	res.status(200).send(data)
    	} catch(error){
        	res.status(500).json({message: error.message})
    	}
	})
	app.post('/api/apod', async(req, res) => {
    	try {
        	const data = await mongodb.coll.insertOne(req.body)
        	res.status(200).json(data)
    	} catch(error){
        	res.status(500).json({message: error.message})
    	}
	})


	const fileRouter = require('./api/routes/routes.js')

	app.use('/api/apod', fileRouter)

	app.listen(PORT, async() => {
    	console.log('Ready!')
	})

}

restapi()










