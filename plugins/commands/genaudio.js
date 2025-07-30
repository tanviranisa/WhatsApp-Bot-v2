const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 'genaudio',
    aliases: ['tts', 'speak'],
    description: 'Generate audio from text using AI voices',
    author: 'sslsoftnow',
    cooldown: 15,
    role: 0,
    category: 'AI'
  },

  onCmd: async ({ args, reply }) => {
    if (args.length === 0) {
      return reply('Please provide text to convert to speech. Example: .genaudio Hello world --voice alloy');
    }

    // Default voice
    let voice = 'alloy';
    let text = args.join(' ');
    
    // Check for voice parameter
    const voiceIndex = args.findIndex(arg => arg === '--voice');
    if (voiceIndex !== -1 && args.length > voiceIndex + 1) {
      voice = args[voiceIndex + 1];
      text = [...args.slice(0, voiceIndex), ...args.slice(voiceIndex + 2)].join(' ');
    }

    if (!text) {
      return reply('Please provide text to convert to speech.');
    }
    
    try {
      const encodedText = encodeURIComponent(text);
      const audioUrl = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voice}`;
      
      // Download the audio
      const response = await axios({
        method: 'GET',
        url: audioUrl,
        responseType: 'arraybuffer'
      });

      // Save the audio temporarily
      const tempDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const audioPath = path.join(tempDir, `audio_${Date.now()}.mp3`);
      fs.writeFileSync(audioPath, Buffer.from(response.data));

      // Send the audio
      await reply({
        audio: { stream: fs.createReadStream(audioPath) },
        mimetype: 'audio/mp3',
        caption: `🔊 Generated audio using voice: ${voice}`
      });

      // Delete the temporary audio file
      setTimeout(() => {
        try {
          fs.unlinkSync(audioPath);
        } catch (err) {
          console.error('Failed to delete temporary audio:', err);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error generating audio:', error);
      reply('❌ Failed to generate audio. Please try again with a different text or voice.');
    }
  }
};