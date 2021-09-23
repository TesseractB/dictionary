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
    gid: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    HIGHEST_COLORED_ROLE_POS: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    FIRST_TIME_SETUP: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    CHANNEL_LOCK: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    CHANNEL_LOCK_CHANNEL: {
        type: Sequelize.INTEGER
    }
})

const privData = priv.define('data', {
    gid: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    HIGHEST_COLORED_ROLE_POS: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    FIRST_TIME_SETUP: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    CHANNEL_LOCK: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    CHANNEL_LOCK_CHANNEL: {
        type: Sequelize.INTEGER
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