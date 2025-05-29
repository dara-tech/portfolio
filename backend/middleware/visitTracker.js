// visitTracker.js
import { sendTelegramAlert } from '../utils/telegramAlert.js';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export const trackVisit = async (req, res, next) => {
    const referrer = req.headers['referer'] || '';
    const isFrontendVisit = referrer.includes('localhost:5173') || referrer.includes('daracheol-6adc.onrender.com');
    const isAssetRequest = req.path.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|ttf|map)$/);

    console.log('Visit tracking:', {
        path: req.path,
        referrer,
        isFrontendVisit,
        isAssetRequest
    });

    if (!isFrontendVisit || req.path === '/favicon.ico' || isAssetRequest || req.cookies._visited) {
        return next();
    }

    // Set a cookie to avoid sending multiple alerts
    res.cookie('_visited', 'true', { maxAge: 10 * 60 * 1000, httpOnly: true });

    try {
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const path = req.path;
        const userAgent = req.headers['user-agent'];

        const ua = new UAParser(userAgent);
        const browser = ua.getBrowser();
        const os = ua.getOS();
        const device = ua.getDevice();

        const geo = geoip.lookup(ip === '::1' ? '8.8.8.8' : ip);

        const queryParams = Object.keys(req.query).length > 0
            ? `\n📎 Query Params: ${JSON.stringify(req.query)}`
            : '';

        const message = `🚨 New Website Visit!\n\n` +
            `📍 Path: ${path}${queryParams}\n` +
            `🔗 Referrer: ${referrer}\n\n` +
            `🌐 Location:\n` +
            `   • Country: ${geo ? `${geo.country} ${getCountryFlag(geo.country)}` : 'Unknown'}\n` +
            `   • City: ${geo ? geo.city || 'Unknown' : 'Unknown'}\n` +
            `   • Timezone: ${geo ? geo.timezone : 'Unknown'}\n\n` +
            `💻 Device Info:\n` +
            `   • Browser: ${browser.name || 'Unknown'} ${browser.version || ''}\n` +
            `   • OS: ${os.name || 'Unknown'} ${os.version || ''}\n` +
            `   • Device: ${getDeviceInfo(device)}\n\n` +
            `🔒 Technical Details:\n` +
            `   • IP: ${maskIP(ip)}\n` +
            `   • Method: ${req.method}\n` +
            `   • Time: ${new Date().toLocaleString()}\n` +
            `   • Protocol: ${req.protocol.toUpperCase()}`;

        await sendTelegramAlert(message, '-1002508835850');
    } catch (error) {
        console.error('Failed to track visit:', error);
    }
    next();
};

function maskIP(ip) {
    if (ip === '::1') return 'localhost';
    return ip.replace(/\d+\.\d+\.\d+\.(\d+)/, '***.***.***.$1');
}

function getCountryFlag(countryCode) {
    if (!countryCode) return '';
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function getDeviceInfo(device) {
    if (device.type) {
        return `${device.type} ${device.vendor || ''} ${device.model || ''}`.trim();
    }
    return 'Desktop/Laptop';
}