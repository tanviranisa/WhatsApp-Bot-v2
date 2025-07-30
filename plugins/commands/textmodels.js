const axios = require('axios');

module.exports = {
  config: {
    name: 'textmodels',
    aliases: ['aimodels', 'listtextmodels'],
    description: 'List all available AI text generation models',
    author: 'sslsoftnow',
    cooldown: 30,
    role: 0,
    category: 'AI'
  },

  onCmd: async ({ reply }) => {
    try {
      const response = await axios.get('https://text.pollinations.ai/models');
      
      if (response.data && Array.isArray(response.data)) {
        const modelList = response.data.join('\n• ');
        reply(`📋 Available Text Generation Models:\n\n• ${modelList}`);
      } else {
        reply('❌ Failed to retrieve text models. The response format was not as expected.');
      }
    } catch (error) {
      console.error('Error fetching text models:', error);
      reply('❌ Failed to retrieve text models. Please try again later.');
    }
  }
};