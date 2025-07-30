module.exports = {
  config: {
    name: "restart",
    aliases: ["reboot"],
    description: "Restart the bot.",
    author: "sslsoftnow",
    cooldown: 5,
    role: 2,
    category: "Admin"
  },

  onCmd: async ({ reply, event }) => {
    const { message } = event;
    const process = require("process");
    
    await reply("Restarting....", { quoted: message });
    process.exit(1);
  }
};