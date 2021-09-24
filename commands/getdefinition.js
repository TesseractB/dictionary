const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getdefinition")
        .setDescription("Gets a definition from a dictionary")
        .addStringOption((option) => 
            option
                .setName("term")
                .setDescription("The term to get")
                .setRequired(true)
        )
        .addBooleanOption(option => 
            option
                .setName("priv")
                .setDescription("Whether or not this term is private")
                .setRequired(true)
        ),
    async execute(interaction, client, data, privData) {
        const term = interaction.options.getString("term")
        if (interaction.options.getBoolean("priv")) {
            const row = await privData.findOne({where: {uid: interaction.member.id}})
            if (!row) {return interaction.reply("You don't have a private dictionary yet")}
            const terms = row.terms.split(",")
            const definitions = row.definitions.split(",")
            const index = terms.indexOf(term)
            if (!index) {return interaction.reply("There are no terms matching the one you provided in this dictionary")}
            interaction.reply("Find your terms below")
            interaction.followUp(terms[index])
            for (const substr of splitStr(definitions[index])) {
                interaction.followUp(substr)
            }
        } else {
            const row = await data.findOne({where: {term: term}})
            if (!row) {return interaction.reply("Term doesn't exist.")}

            interaction.reply("Find your terms below")
            interaction.followUp("Term:\n```\n" + row.term + "\n```")
            for (const substr of splitStr(row.definition)) {
                interaction.followUp("Definition:\n```\n" + substr + "\n```")
            }
        }
    }
}


function splitStr(str) {
    return str.match(/.{1,1983}/g)
}