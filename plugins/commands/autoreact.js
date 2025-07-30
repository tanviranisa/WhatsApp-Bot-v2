module.exports = {
  config: {
    name: "autoreact",
    aliases: [],
    description: "Automatically reacts to messages in a thread.",
    author: "Mohammad Nayan",
    cooldown: 5,
    role: 0,
    category: "utility"
  },
  onCmd: async ({ reply, args, event }) => {
    const { threadId } = event;
    const status = args[0]?.toLowerCase();

    if (status === 'on') {
      await global.data.set('autoreact.json', { [threadId]: true });
      reply('Autoreact is now *ON* for this thread.');
    } else if (status === 'off') {
      const data = await global.data.get('autoreact.json') || {};
      delete data[threadId];
      await global.data.set('autoreact.json', data);
      reply('Autoreact is now *OFF* for this thread.');
    } else {
      reply('Usage: autoreact [on/off]');
    }
  },
  onEvent: async ({ event, react }) => {
    const { threadId } = event;
    const data = await global.data.get('autoreact.json') || {};
    const emojis = ['👍', '😂', '❤️', '😮', '😢', '😡', '🔥', '😍', '🎉', '🤔', '💯', '👏', '🤩', '👌', '😎'];

    if (data[threadId]) {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      react(randomEmoji);
    }
  }
};