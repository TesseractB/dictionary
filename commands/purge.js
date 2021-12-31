const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Deletes term from dictionary")
        .addStringOption((option) => 
            option
                .setName("term")
                .setDescription("The term to purge")
                .setRequired(true)
        ),
    async execute(interaction, client, data, privData) {
        const term = interaction.options.getString("term")
        const pubrow = await data.destroy({where: {term: term, uid: interaction.member.id}})
        if (!pubrow) interaction.editReply('Term did not exist in public dictionary under your name. If it is a private term, you musk seek divine intervention with a fee of {FEE} from Tesseract.')
        interaction.reply("Purged.")
    }
}