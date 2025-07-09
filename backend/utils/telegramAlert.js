import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('❌ TELEGRAM_BOT_TOKEN is not defined in environment variables.');
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

const messageQueue = [];
let isProcessing = false;
let lastMessageTime = 0;
const MIN_DELAY = 3000; // 3 seconds

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Escape special characters for MarkdownV2 formatting in Telegram
 * @param {string | number | null | undefined} text
 * @returns {string}
 */
export function escapeMarkdown(text) {
    if (text === null || typeof text === 'undefined') return '';
    return text.toString().replace(/([\\`*_\[\]()~>#+\-=|{}.!])/g, '\\$1');
}

/**
 * Internal function to handle queued Telegram messages with delay to prevent rate limits
 */
async function processQueue() {
    if (isProcessing || messageQueue.length === 0) return;

    isProcessing = true;

    while (messageQueue.length > 0) {
        const { message, chatId, resolve, reject } = messageQueue[0];

        const now = Date.now();
        const timeSinceLastMessage = now - lastMessageTime;
        if (timeSinceLastMessage < MIN_DELAY) {
            await delay(MIN_DELAY - timeSinceLastMessage);
        }

        try {
            const result = await bot.sendMessage(chatId, message, { parse_mode: 'MarkdownV2' });
            messageQueue.shift();
            lastMessageTime = Date.now();
            resolve(result);
        } catch (error) {
            console.error('❌ Telegram send error:', error.message);

            if (error.response?.statusCode === 429) {
                const retryAfter = (error.response.body?.parameters?.retry_after || 30) * 1000;
                console.warn(`⏳ Rate limited. Retrying in ${retryAfter / 1000} seconds...`);
                await delay(retryAfter);
                continue; // Retry same message
            }

            messageQueue.shift(); // Drop failed message
            reject(error);
        }
    }

    isProcessing = false;
}

/**
 * Send a raw MarkdownV2 Telegram message (with queue & rate limiting)
 * @param {string} message - MarkdownV2 formatted string
 * @param {string} chatId - Telegram Chat ID
 */
export const sendTelegramAlert = (message, chatId) => {
    if (!chatId) {
        throw new Error('❌ Chat ID is required to send a Telegram message.');
    }

    return new Promise((resolve, reject) => {
        messageQueue.push({ message, chatId, resolve, reject });
        processQueue();
    });
};

/**
 * Send a formatted message with title + body (MarkdownV2)
 * @param {Object} options
 * @param {string} options.title - Bolded MarkdownV2 title
 * @param {string} options.message - Main body text
 * @param {string} [options.type=info] - info | warning | error
 * @param {string} options.chatId - Telegram Chat ID
 */
export const sendFormattedAlert = async ({ title, message, type = 'info', chatId }) => {
    const emoji = {
        info: 'ℹ️',
        warning: '⚠️',
        error: '🚨'
    };

    const formattedMessage = `${emoji[type] || ''} *${escapeMarkdown(title)}*\n\n${escapeMarkdown(message)}`;
    return sendTelegramAlert(formattedMessage, chatId);
};
