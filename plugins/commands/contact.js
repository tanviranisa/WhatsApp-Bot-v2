module.exports = {
  config: {
    name: 'contact',
    aliases: [],
    description: 'Send contact information for Code Whisperer.',
    author: 'Code Whisperer',
    cooldown: 5,
    role: 2,
    category: 'Utilities'
  },

  onCmd: async ({ event, api }) => {
    const { threadId } = event;

    const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n' 
            + 'FN:Code Whisperer \n'
            + 'ORG:Nayan;\n'
            + 'TEL;type=CELL;type=VOICE;waid=8801924705551:01924705551\n'
            + 'END:VCARD';

    await api.sendMessage(
      threadId,
      { 
        contacts: { 
          displayName: 'Code Whisperer', 
          contacts: [{ vcard }] 
        }
      }
    );
  }
};