const Discord = require('discord.js')
const { Client,Intents,MessageActionRow,MessageButton,Permissions,Collection } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const Sequelize = require("sequelize");
const config = require("./config.js")
const fs = require("fs");

client.config = config
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
//DB Initialization
const pub = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'data.sqlite'
});
const priv = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'privdata.sqlite'
});
//DB Initialization
const data = pub.define('data', {
    term: {
        primaryKey: true,
        type: Sequelize.STRING,
        
    },
    definition: {
        type: Sequelize.TEXT,
    },
    uid: {
        type: Sequelize.INTEGER
    }
})

const privData = priv.define('data', {
    uid: {
        primaryKey: true,
        type: Sequelize.INTEGER
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
    interaction.guild.commands.set([])
    
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

client.login(config.secret)