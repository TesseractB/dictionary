const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dictionary")
        .setDescription("Gets all of the definitions in the public dictionary"),
    async execute(interaction, client, data, privData) {
        const table = await data.findAll()
        const final = []
        final.push("```")
        for (const row of table) {
            const temp = []
            temp.push(row.term)
            temp.push(row.definition)
            final.push(temp.join(" - "))
        }
        final.push("```")
        interaction.reply("Here are all of the definitions")
        for (const msg of splitStr(final.join("\n"))) {interaction.followUp(msg)}
    }
}
function splitStr(str) {
    return str.match(/(.|[\r\n]){1,1999}/g)
}