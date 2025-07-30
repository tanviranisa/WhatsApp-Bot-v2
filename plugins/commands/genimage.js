const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 'genimage',
    aliases: ['imggen', 'createimg'],
    description: 'Generate an image using AI based on your prompt',
    author: 'sslsoftnow',
    cooldown: 10,
    role: 0,
    category: 'AI'
  },

  onCmd: async ({ event, args, reply }) => {
    if (args.length === 0) {
      return reply('Please provide a prompt to generate an image. Example: .genimage a beautiful sunset over mountains');
    }

    const prompt = encodeURIComponent(args.join(' '));
    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}`;
    
    try {
      // Download the image
      const response = await axios({
        method: 'GET',
        url: imageUrl,
        responseType: 'arraybuffer'
      });

      // Save the image temporarily
      const tempDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const imagePath = path.join(tempDir, `generated_${Date.now()}.png`);
      fs.writeFileSync(imagePath, Buffer.from(response.data, 'binary'));

      // Send the image
      await reply({
        image: { stream: fs.createReadStream(imagePath) },
        caption: `🖼️ Generated image for: "${args.join(' ')}"`
      });

      // Delete the temporary image
      setTimeout(() => {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error('Failed to delete temporary image:', err);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error generating image:', error);
      reply('❌ Failed to generate image. Please try again with a different prompt.');
    }
  }
};