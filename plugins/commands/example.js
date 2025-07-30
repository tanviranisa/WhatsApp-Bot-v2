module.exports = {
    config: {
        name: 'example',
        aliases: ['ex'],
        description: 'Demonstrates how handleReply and handleReaction work.',
        author: 'Code Whisperer',
        cooldown: 5,
        role: 0,
        category: 'Utility'
    },

    onCmd: async function ({ api, event, handleReply, handleReaction }) {
        const replyMessage = "🔹 Reply to this message or react with any emoji to test handleReply and handleReaction.";

        const sentMessage = await api.sendMessage(event.threadId, { text: replyMessage });

        global.client.handleReply.push({
            name: this.config.name,
            messageID: sentMessage.key.id,
            author: event.senderId
        });

        global.client.handleReaction.push({
            name: this.config.name,
            messageID: sentMessage.key.id,
            author: event.senderId
        });
    },

    handleReply: async function ({ api, event, handleReply, reply }) {
        if (event.senderId !== handleReply.author) return;

        const userReply = event.message.conversation || "";
        reply(`📩 You replied: ${userReply}`);
    },

    handleReaction: async function ({ api, event, handleReaction, reactData, reply }) {
        if (event.senderId !== handleReaction.author) return;

        const reaction = reactData.text;
        reply(`😊 You reacted with: ${reaction}`);
    }
};