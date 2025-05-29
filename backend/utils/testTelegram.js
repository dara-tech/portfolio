import { sendTelegramAlert } from './telegramAlert.js';

// Test function
const testTelegramBot = async () => {
    try {
        // First, let's get your chat ID
        console.log('\n1. Please make sure you have:')
        console.log('   - Found your bot on Telegram')
        console.log('   - Started a chat with your bot')
        console.log('   - Sent /start command to your bot')
        console.log('\n2. Then visit this URL to get updates (it will show your chat_id):')
        console.log('https://api.telegram.org/bot7937888193:AAGU_eL8VRViD80vaOGke1SU4UkSrjBQgIk/getUpdates')
        
        // We'll try sending to your direct messages first
        const message = "🔔 Test alert from your portfolio bot\n\n" +
                      "This is a test message sent at: " + new Date().toLocaleString();
        
        // Replace this with your chat ID from the getUpdates API response
        const yourChatId = '-1002508835850'; // Portflio View channel ID
        
        console.log('\nSending test message...');
        const result = await sendTelegramAlert(message, yourChatId);
        console.log('✅ Alert sent successfully!');

    } catch (error) {
        console.error('❌ Failed to send alert:', error.message);
        if (!error.message.includes('chat not found')) {
            console.error('Full error:', error);
        }
    }
};

testTelegramBot();
