module.exports = {
    config: {
        name: 'autoreply',
        aliases: ['ar'],
        description: 'Automatically replies to specific messages from users.',
        author: 'Code Whisperer',
        cooldown: 5,
        role: 0,
        category: 'greetings'
    },
    
    onEvent: async ({ event, reply, body }) => {
        const userMessage = body.toLowerCase();
        
        if (userMessage === 'ck' || userMessage === 'hello' || userMessage === 'hlw') {
            reply('Hi, How can I help you?\nYou can use .menu for more info and commands.');
        }
    }
};