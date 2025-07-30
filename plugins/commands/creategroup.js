module.exports = {
  config: {
    name: 'creategroup',
    aliases: ['groupcreate', 'newgroup'],
    description: 'Create a new WhatsApp group with specified participants.',
    author: 'Code Whisperer',
    cooldown: 5,
    role: 0,
    category: 'group'
  },

  onCmd: async ({ event, api, args, reply }) => {
    const { threadId, mentions, senderId } = event;

    if (args.length < 1 || Object.keys(mentions).length === 0) {
      reply('Usage: .creategroup <group name> @mention1 @mention2 ...');
      return;
    }

    const messages = args.join(' ')
    const arg = messages.split(' ');
    const mentionsStartIndex = arg.findIndex(arg => arg.startsWith('@'));
    const groupName = mentionsStartIndex === -1 ? arg.join(' ') : arg.slice(0, mentionsStartIndex).join(' ');

    console.log(groupName);
  
    const participants = [senderId, ...Object.keys(mentions)];

    if (participants.length === 0) {
      reply('Please mention at least one participant to add to the group.');
      return;
    }

    try {
      const group = await api.groupCreate(groupName, participants);

      console.log('Created group with ID: ' + group.id);
      await api.sendMessage(group.id, { text: 'Hello everyone! Welcome to ' + groupName + '!' });

      reply(`Group "${groupName}" created successfully with ID: ${group.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
      reply('An error occurred while creating the group. Please try again later.');
    }
  },
};