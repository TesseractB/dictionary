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
            const data = await privData.findOrCreate({where: {uid: interaction.member.id}, defaults: {uid: interaction.member.id}})
            privData.findOne({where: {uid: interaction.member.id}}).then(async function(profile) {
                const preterms = profile.terms
                console.log(preterms)
                const terms = preterms.split(',')
                const predefinitions = profile.definitions
                const definitions = predefinitions.split(',')
                if (terms.includes(term)) {return interaction.reply({content: "Term already defined.", ephemeral: true})}
                interaction.reply("Adding your term to the dictionary")
                terms.push(term)
                definitions.push(definition)
                privData.update({
                    terms: terms.join(","),
                    definitions: definitions.join(',')
                },{where: {uid: interaction.member.id}})
            })

        }
        
        else {
            if (await data.findOne({where: {term: term}})) {return interaction.reply({content: "Term already defined.", ephemeral: true})}
            interaction.reply("Adding your term to the dictionary")
            const newdata = await data.create({
                uid: interaction.member.id,
                term: term,
                definition: definition
            })
        }
    }
}