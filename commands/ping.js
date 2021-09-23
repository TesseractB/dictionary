const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Gets the ping of the bot")
        .addBooleanOption((option) => 
            option
                .setName("fulltrip")
                .setDescription("Whether or not to perform a full trip ping")
                .setRequired(false)
        ),
    async execute(interaction, client) {
        if (interaction.options.getBoolean("fulltrip")) {
            await interaction.reply("Pinging...")
            await interaction.editReply(`Pong! Fulltrip latency is \`${Date.now() - interaction.createdTimestamp}ms\``)
        }
        else {interaction.reply(`Pong! Latency is \`${client.ws.ping}ms\``)}
    }
}