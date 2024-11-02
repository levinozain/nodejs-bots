const { SlashCommandBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gemini')
		.setDescription('Provides Gemini AI ChatBot')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The input to gemini')
                .setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
        
        const genAI = new GoogleGenerativeAI("AIzaSyAPbJEicZ9EHys-zr_32q-XyAUVSTY099I");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let input = interaction.options.getString('input');

        const prompt = input;

        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        
        await interaction.followUp(`${response}`);
	},
};
