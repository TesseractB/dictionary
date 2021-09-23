const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("define")
        .setDescription("Defines a term")
        .addStringOption(option => 
            option
                .setName("term")
                .setDescription("The term you are going to define")
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName("definition")
                .setDescription("The definition of the term you are going to define")
                .setRequired(true)
        )
        .addBooleanOption(option => 
            option
                .setName("priv")
                .setDescription("Whether or not this term will be private")
                .setRequired(true)
        ),
    async execute(interaction, client, data, privData) {
        const term = interaction.options.getString("term")
        const definition = interaction.options.getString("definition")
        if (interaction.options.getBoolean("priv")) {
            await privData.findOrCreate({where: {uid: interaction.member.id}, defaults: {uid: interaction.member.id}})
            await privData.findOne({where: {uid: interaction.member.id}}).then(function(profile) {
                const terms = profile.terms.split(',')
                const definitions = profile.definitions.split(',')
                if (terms.includes(term)) {return interaction.reply({content: "Term already defined.", ephemeral: true})}
                terms.push(term)
                definitions.push(definition)
                privData.update({
                    terms: terms.join(","),
                    definitions: definitions.join(',')
                },{where: {uid: interaction.member.id}})
            })

        }
        else {interaction.reply(`Pong! Latency is \`${client.ws.ping}ms\``)}
    }
}