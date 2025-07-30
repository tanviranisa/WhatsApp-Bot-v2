const { alldown } = require("imon-videos-downloader");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "alldown",
    aliases: ["vd"],
    description: "Download video from a given URL and send the video file.",
    author: "sslsoftnow",
    cooldown: 5,
    role: 0,
    category: "Media"
  },
  
  onCmd: async ({ reply, args, event, react }) => {
    const { threadId } = event;

    if (!args[0] || !args[0].startsWith("http")) {
      reply(`Please provide a valid URL. Usage: alldown <URL>`);
      return;
    }

    const url = args[0];

    try {
      const data = await alldown(url);

      if (!data || !data.data) {
        await react("❌");
        reply("Failed to fetch video details. Please check the URL and try again.");
        return;
      }

      const videoDetails = data.data;
      const lowQualityVideo = videoDetails.low;
      const videoFileName = path.join(__dirname, `temp_video_${Date.now()}.mp4`);

      const videoStream = await axios({
        url: lowQualityVideo,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(videoFileName);
      videoStream.data.pipe(writer);

      writer.on("finish", async () => {
        try {
          await react("✔️");
          await reply({
            video: { stream: fs.createReadStream(videoFileName) },
            caption: `🎥 *Video Details* 🎥\n\n*Title:* ${videoDetails.title}`,
          });

          fs.unlink(videoFileName, (err) => {
            if (err) console.error(`Failed to delete file ${videoFileName}:`, err);
          });
        } catch (sendError) {
          console.error("Error sending video:", sendError);
        }
      });

      writer.on("error", async (error) => {
        console.error("Error writing video file:", error);
        reply("An error occurred while downloading the video. Please try again.");
      });
    } catch (error) {
      console.error("Error fetching video details:", error);
      reply("An error occurred while fetching the video. Please try again.");
    }
  },

  onEvent: async ({ event, body, reply, react }) => {
    const { threadId } = event;

    if (!body || !body.startsWith("https")) return;

    const url = body.trim();

    try {
      const data = await alldown(url);

      if (!data || !data.data) {
        await react("❌");
        reply("Failed to fetch video details. Please check the URL and try again.");
        return;
      }

      const videoDetails = data.data;
      const lowQualityVideo = videoDetails.low;
      const videoFileName = path.join(__dirname, `temp_video_${Date.now()}.mp4`);

      const videoStream = await axios({
        url: lowQualityVideo,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(videoFileName);
      videoStream.data.pipe(writer);

      writer.on("finish", async () => {
        try {
          await react("✔️");
          await reply({
            video: { stream: fs.createReadStream(videoFileName) },
            caption: `🎥 *Video Details* 🎥\n\n*Title:* ${videoDetails.title}`,
          });

          fs.unlink(videoFileName, (err) => {
            if (err) console.error(`Failed to delete file ${videoFileName}:`, err);
          });
        } catch (sendError) {
          console.error("Error sending video:", sendError);
        }
      });

      writer.on("error", async (error) => {
        console.error("Error writing video file:", error);
        reply("An error occurred while downloading the video. Please try again.");
      });
    } catch (error) {
      console.error("Error fetching video details:", error);
      reply("An error occurred while fetching the video. Please try again.");
    }
  }
};