const Discord = require('discord.js')
const { Client,Intents,MessageActionRow,MessageButton,Permissions,Collection } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const Sequelize = require("sequelize");

const fs = require("fs");
const dotenv = require("dotenv")
dotenv.config()
const express = require("express");
const path = require("path");
const app = express(); 
const port = process.env.PORT
app.get("/", (req, res) => { res.status(200).send("you shouldn't be here"); });
app.listen(port, () => { console.log(`Listening to requests on http://localhost:${port}`); });
var http = require("http");
setInterval(function() {
   http.get(`http://${process.env.HEROKU_APP_NAME}.herokuapp.com`);
}, 300000); // every 5 minutes (300000)
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
//DB Initialization
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            required: true,
            rejectUnauthorized: false
        }
    }
})
//DB Initialization
const data = sequelize.define('data', {
    term: {
        primaryKey: true,
        type: Sequelize.STRING,
        
    },
    definition: {
        type: Sequelize.TEXT,
    },
    uid: {
        type: Sequelize.BIGINT
    }
})

const privData = sequelize.define('privdata', {
    uid: {
        primaryKey: true,
        type: Sequelize.BIGINT
    },
    terms: {
        type: Sequelize.STRING,
        defaultValue: ","
    },
    definitions: {
        type: Sequelize.STRING,
        defaultValue: ","
    }
})


client.on("ready", () => {
    console.log(`Logged in as ${client.user.username}`)
    data.sync({alter:true})
    privData.sync({alter:true})
    console.log("Synced Databases")
})

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) {return}
    const command = client.commands.get(interaction.commandName)

    
    if (!command) {return}

    try {
        await command.execute(interaction, client, data, privData);
    }
    catch (err) {
        console.log(err);
        try {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
        catch (err){return}
    }
})

client.login(process.env.TOKEN)