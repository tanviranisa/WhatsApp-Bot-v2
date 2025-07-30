const request = require('request');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: 'profilepic',
    aliases: ['pp', 'avatar'],
    description: 'Send the profile picture of the mentioned user or yourself.',
    author: 'Code Whisperer',
    cooldown: 5,
    role: 0,
    category: 'media'
  },

  onCmd: async ({ event, reply }) => {
    const { senderId, mentions, getProfilePictureUrls } = event;
    const ids = Object.keys(mentions).length > 0 ? Object.keys(mentions) : [senderId];

    try {
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const urls = await getProfilePictureUrls(ids);
      const validUrls = Object.entries(urls).filter(([id, url]) => url && !url.includes('Error'));
      
      if (validUrls.length === 0) {
        reply('No profile picture available for the specified user(s).');
        return;
      }

      for (const [id, url] of validUrls) {
        const filePath = path.join(cacheDir, `profile_${id}.jpg`);
        
        request({ url, encoding: null }, (err, res, body) => {
          if (!err && res.statusCode === 200) {
            fs.writeFileSync(filePath, body);
            console.log('File downloaded and saved successfully.');
            
            const caption = Object.keys(mentions).includes(id)
              ? `Profile picture of @${id.split('@')[0]}`
              : 'Profile picture of you.';

            reply({
              image: { stream: fs.createReadStream(filePath) },
              caption: caption,
              mentions: [id]
            }).then(() => {
              // Remove file after sending
              fs.unlinkSync(filePath);
            }).catch(err => {
              console.error('Error sending image:', err);
              fs.unlinkSync(filePath);
            });
            
          } else {
            console.error('Failed to download file:', err || res.statusCode);
            reply('Failed to download profile picture.');
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile pictures:', error);
      reply('An error occurred while fetching the profile pictures. Please try again later.');
    }
  }
};