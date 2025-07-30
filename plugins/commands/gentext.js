const axios = require('axios');

module.exports = {
  config: {
    name: 'gentext',
    aliases: ['textgen', 'ai'],
    description: 'Generate text using AI based on your prompt',
    author: 'sslsoftnow',
    cooldown: 5,
    role: 0,
    category: 'AI'
  },

  onCmd: async ({ args, reply }) => {
    if (args.length === 0) {
      return reply('Please provide a prompt for text generation. Example: .gentext Write a short story about space exploration');
    }

    const prompt = encodeURIComponent(args.join(' '));
    
    try {
      const response = await axios.get(`https://text.pollinations.ai/${prompt}`);
      
      if (response.data) {
        reply(`🤖 AI Response:\n\n${response.data}`);
      } else {
        reply('❌ The AI didn\'t return any text. Please try a different prompt.');
      }
    } catch (error) {
      console.error('Error generating text:', error);
      reply('❌ Failed to generate text. Please try again later.');
    }
  }
};