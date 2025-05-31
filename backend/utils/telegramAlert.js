import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Queue for pending messages
let messageQueue = [];
let isProcessing = false;

// Delay helper function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Process the message queue with rate limiting
 */
async function processQueue() {
    if (isProcessing || messageQueue.length === 0) {
        console.log('💬 Queue status:', { isProcessing, queueLength: messageQueue.length });
        return;
    }
    
    console.log('📦 Starting to process message queue. Length:', messageQueue.length);
    isProcessing = true;
    
    while (messageQueue.length > 0) {
        const { message, chatId, resolve, reject, attempts = 0 } = messageQueue[0];
        
        try {
            console.log('💬 Sending message to Telegram. Attempt:', attempts + 1);
            const result = await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            messageQueue.shift(); // Remove the processed message
            console.log('✅ Successfully sent message to Telegram');
            resolve(result);
            
            // Add a longer delay between messages to avoid rate limiting
            if (messageQueue.length > 0) {
                console.log('⏳ Waiting 3 seconds before next message...');
                await delay(3000); // 3 second delay between messages
            }
        } catch (error) {
            console.error('❌ Error sending message:', error.message);
            
            if (error.code === 'TelegramError' && error.response?.statusCode === 429) {
                const retryAfter = error.response.body?.parameters?.retry_after || 5;
                console.log(`⏳ Rate limited. Waiting ${retryAfter} seconds...`);
                
                if (attempts < 3) { // Max 3 retry attempts
                    // Move to the end of the queue with increased attempts
                    const currentMessage = messageQueue.shift();
                    messageQueue.push({ ...currentMessage, attempts: attempts + 1 });
                    await delay(retryAfter * 1000);
                } else {
                    console.error('❌ Max retry attempts reached. Dropping message.');
                    messageQueue.shift();
                    reject(error);
                }
            } else {
                console.error('❌ Non-rate-limit error. Dropping message.');
                messageQueue.shift();
                reject(error);
            }
        }
    }
    
    console.log('🌀 Queue processing complete');
    isProcessing = false;
}

/**
 * Send an alert message to a specific Telegram chat with rate limiting and retries
 * @param {string} message - The message to send
 * @param {string} chatId - The Telegram chat ID to send the message to
 * @returns {Promise} - The result of sending the message
 */
export const sendTelegramAlert = async (message, chatId) => {
    console.log('📣 Attempting to send Telegram alert:', {
        chatId,
        messageLength: message.length
    });

    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error('❌ TELEGRAM_BOT_TOKEN is not configured');
        throw new Error('TELEGRAM_BOT_TOKEN is not configured');
    }

    if (!chatId) {
        console.error('❌ Chat ID is required');
        throw new Error('Chat ID is required');
    }

    console.log('📬 Adding message to queue. Current queue size:', messageQueue.length);
    return new Promise((resolve, reject) => {
        messageQueue.push({ message, chatId, resolve, reject });
        processQueue();
    });
};

/**
 * Send an alert message with additional details
 * @param {Object} options
 * @param {string} options.title - Alert title
 * @param {string} options.message - Alert message
 * @param {string} options.type - Alert type (info, warning, error)
 * @param {string} options.chatId - Telegram chat ID
 */
export const sendFormattedAlert = async ({ title, message, type = 'info', chatId }) => {
    const emoji = {
        info: 'ℹ️',
        warning: '⚠️',
        error: '🚨'
    };

    const formattedMessage = `${emoji[type]} *${title}*\n\n${message}`;
    
    return sendTelegramAlert(formattedMessage, chatId);
};
