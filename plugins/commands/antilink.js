const setAntilinkSetting = global.setAntilinkSetting;
const getAntilinkSetting = global.getAntilinkSetting;

module.exports = {
  config: {
    name: 'antilink',
    aliases: ['al'],
    description: 'Manage and enforce link-blocking policies in your group to prevent spam.',
    author: 'Code Whisperer',
    cooldown: 5,
    role: 2,
    category: 'Moderation'
  },

  onCmd: async ({ event, api, args, reply }) => {
    const { threadId, isSenderAdmin } = event;
    
    if (!isSenderAdmin) {
      reply('Only admins can use the .antilink command.');
      return;
    }

    const subCommand = args[0]?.toLowerCase();

    if (!subCommand) {
      const helpMessage = `
*Antilink Commands:*
1. *.antilink off* - Disable antilink protection.
2. *.antilink whatsapp* - Block WhatsApp group links.
3. *.antilink whatsappchannel* - Block WhatsApp channel links.
4. *.antilink telegram* - Block Telegram links.
5. *.antilink all* - Block all types of links.
      `;
      reply(helpMessage);
      return;
    }
    
    switch (subCommand) {
      case 'off':
        setAntilinkSetting(threadId, 'off');
        reply('Antilink protection is now turned off.');
        break;
      case 'whatsapp':
        setAntilinkSetting(threadId, 'whatsappGroup');
        reply('WhatsApp group links are now blocked.');
        break;
      case 'whatsappchannel':
        setAntilinkSetting(threadId, 'whatsappChannel');
        reply('WhatsApp channel links are now blocked.');
        break;
      case 'telegram':
        setAntilinkSetting(threadId, 'telegram');
        reply('Telegram links are now blocked.');
        break;
      case 'all':
        setAntilinkSetting(threadId, 'allLinks');
        reply('All types of links are now blocked.');
        break;
      default:
        reply('Invalid subcommand. Use .antilink for help.');
    }
  },

  onEvent: async ({ event, api, body }) => {
    const { threadId, senderId, message } = event;
    const antilinkSetting = getAntilinkSetting(threadId);

    if (antilinkSetting === 'off') return;
    
    const linkPatterns = {
      whatsappGroup: /chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/,
      whatsappChannel: /wa\.me\/channel\/[A-Za-z0-9]{20,}/,
      telegram: /t\.me\/[A-Za-z0-9_]+/,
      allLinks: /https?:\/\/[^\s]+/,
    };

    let shouldDelete = false;
    
    if (
      (antilinkSetting === 'whatsappGroup' && linkPatterns.whatsappGroup.test(body)) ||
      (antilinkSetting === 'whatsappChannel' && linkPatterns.whatsappChannel.test(body)) ||
      (antilinkSetting === 'telegram' && linkPatterns.telegram.test(body)) ||
      (antilinkSetting === 'allLinks' && linkPatterns.allLinks.test(body))
    ) {
      shouldDelete = true;
    }

    if (shouldDelete) {
      try {
        const quotedMessageId = message.key.id;
        const quotedParticipant = message.key.participant || senderId;
        
        await api.sendMessage(threadId, {
          delete: { remoteJid: threadId, fromMe: false, id: quotedMessageId, participant: quotedParticipant },
        });

        console.log(`Deleted message with ID ${quotedMessageId} from ${quotedParticipant}.`);
        
        await api.sendMessage(threadId, {
          text: `Warning! @${senderId.split('@')[0]}, posting links is not allowed.`,
          mentions: [senderId],
        });
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
  },
};