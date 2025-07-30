const axios = require('axios');

module.exports = {
  config: {
    name: 'imagemodels',
    aliases: ['imgmodels', 'listimagemodels'],
    description: 'List all available AI image generation models',
    author: 'sslsoftnow',
    cooldown: 30,
    role: 0,
    category: 'AI'
  },

  onCmd: async ({ reply }) => {
    try {
      const response = await axios.get('https://image.pollinations.ai/models');
      
      if (response.data && Array.isArray(response.data)) {
        const modelList = response.data.join('\n• ');
        reply(`📋 Available Image Generation Models:\n\n• ${modelList}`);
      } else {
        reply('❌ Failed to retrieve image models. The response format was not as expected.');
      }
    } catch (error) {
      console.error('Error fetching image models:', error);
      reply('❌ Failed to retrieve image models. Please try again later.');
    }
  }
};