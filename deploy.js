const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require("dotenv")
dotenv.config()
const fs = require('fs');
const clientId = process.env.CLIENT_ID
const secret = process.env.TOKEN


const rest = new REST({ version: '9' }).setToken(secret);

const commands = []
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}


(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();
