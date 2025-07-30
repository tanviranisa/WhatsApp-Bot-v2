const axios = require('axios');

module.exports = {
  config: {
    name: 'openai',
    aliases: ['oai', 'gpt'],
    description: 'Generate text using OpenAI compatible endpoint',
    author: 'sslsoftnow',
    cooldown: 5,
    role: 0,
    category: 'AI'
  },

  onCmd: async ({ args, reply }) => {
    if (args.length === 0) {
      return reply('Please provide a prompt for the AI. Example: .openai What is the meaning of life?');
    }

    const prompt = args.join(' ');
    
    try {
      const response = await axios.post('https://text.pollinations.ai/openai', {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      if (response.data && response.data.choices && response.data.choices[0]) {
        const aiResponse = response.data.choices[0].message.content;
        reply(`🤖 OpenAI Response:\n\n${aiResponse}`);
      } else {
        reply('❌ The AI didn\'t return a valid response. Please try a different prompt.');
      }
    } catch (error) {
      console.error('Error using OpenAI endpoint:', error);
      reply('❌ Failed to get a response from the AI. Please try again later.');
    }
  }
};