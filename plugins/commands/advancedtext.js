const axios = require('axios');

module.exports = {
  config: {
    name: 'advancedtext',
    aliases: ['advtext', 'textadv'],
    description: 'Generate text using advanced AI parameters',
    author: 'sslsoftnow',
    cooldown: 10,
    role: 0,
    category: 'AI'
  },

  onCmd: async ({ args, reply }) => {
    if (args.length === 0) {
      return reply('Please provide a prompt for advanced text generation. Example: .advancedtext Tell me about quantum physics');
    }

    // Parse model if provided with --model flag
    let model = 'openai-gpt3.5-turbo';
    let prompt = args.join(' ');
    
    const modelFlagIndex = args.findIndex(arg => arg === '--model');
    if (modelFlagIndex !== -1 && args.length > modelFlagIndex + 1) {
      model = args[modelFlagIndex + 1];
      prompt = [...args.slice(0, modelFlagIndex), ...args.slice(modelFlagIndex + 2)].join(' ');
    }
    
    try {
      const response = await axios.post('https://text.pollinations.ai/', {
        prompt: prompt,
        model: model,
        max_tokens: 500,
        temperature: 0.7
      });
      
      if (response.data) {
        reply(`🤖 Advanced AI Response (using ${model}):\n\n${response.data}`);
      } else {
        reply('❌ The AI didn\'t return any text. Please try a different prompt or model.');
      }
    } catch (error) {
      console.error('Error generating advanced text:', error);
      reply('❌ Failed to generate advanced text. Please try again later.');
    }
  }
};