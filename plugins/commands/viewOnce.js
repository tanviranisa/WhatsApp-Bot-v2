const request = require("request");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "viewOnce",
    aliases: ["vv", "vo"],
    description: "Sends an image or video as view-once",
    author: "Mohammad Nayan",
    cooldown: 5,
    role: 0,
    category: "Media"
  },

  onCmd: async ({ event, api, reply }) => {
    try {
      const { message, getLink } = event;
      const result = await getLink(api, message);

      if (result.msg) {
        return reply(result.msg, { quoted: message });
      }

      const { link } = result;
      
      const tempFileName = path.join(__dirname, `temp_media_${Date.now()}`);
      let fileExtension = "";

      if (link.match(/\.(jpeg|jpg|png|gif)$/i)) {
        fileExtension = path.extname(link);
      } else if (link.match(/\.(mp4|mov|avi|mkv)$/i)) {
        fileExtension = path.extname(link);
      } else {
        return reply("❌ Unsupported file type. Please send an image or video.", { quoted: message });
      }

      const finalFileName = tempFileName + fileExtension;
      
      request(link)
        .pipe(fs.createWriteStream(finalFileName))
        .on("close", async () => {
          try {
            if (fileExtension.match(/\.(jpeg|jpg|png|gif)$/i)) {
              await api.sendMessage(event.threadId, {
                image: { stream: fs.createReadStream(finalFileName) },
              }, { quoted: message });
            } else if (fileExtension.match(/\.(mp4|mov|avi|mkv)$/i)) {
              await api.sendMessage(event.threadId, {
                video: { stream: fs.createReadStream(finalFileName) },
              }, { quoted: message });
            }
            
            fs.unlink(finalFileName, (err) => {
              if (err) console.error("Failed to delete temp file:", err);
            });

          } catch (sendError) {
            console.error("Error sending media:", sendError);
            reply("❌ Failed to send the media.", { quoted: message });
          }
        })
        .on("error", async (error) => {
          console.error("Error downloading media:", error);
          reply("❌ Failed to download the media.", { quoted: message });
        });

    } catch (error) {
      console.error("Error processing media:", error);
      reply("❌ An error occurred while processing your request.", { quoted: event.message });
    }
  }
};