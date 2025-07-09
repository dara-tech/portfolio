import { sendTelegramAlert } from '../utils/telegramAlert.js';
import axios from 'axios';
import { UAParser } from 'ua-parser-js';

const geoCache = new Map();
const alertCooldown = new Map(); // Cooldown per IP to avoid spam
const GEO_TTL = 10 * 60 * 1000;  // 10 mins
const ALERT_TTL = 5 * 60 * 1000; // 5 mins

function escapeMarkdown(text) {
    if (text === null || typeof text === 'undefined') return '';
    return text.toString().replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

function getCountryFlag(code) {
    if (!code) return '';
    return String.fromCodePoint(...code.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0)));
}

function getDeviceInfo(device) {
    if (device?.type) {
        const type = device.type.charAt(0).toUpperCase() + device.type.slice(1);
        return `${type} - ${device.vendor || ''} ${device.model || ''}`.trim();
    }
    return 'Desktop/Laptop';
}

async function getGeoData(ip) {
    const cached = geoCache.get(ip);
    const now = Date.now();
    if (cached && now - cached.timestamp < GEO_TTL) return cached.data;

    try {
        const fields = 'status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,query';
        const { data } = await axios.get(`http://ip-api.com/json/${ip}?fields=${fields}`);
        if (data?.status === 'success') {
            geoCache.set(ip, { data, timestamp: now });
            return data;
        }
    } catch (err) {
        console.warn('🌐 IP Lookup Error:', err.message);
    }
    return null;
}

export const trackVisit = async (req, res, next) => {
    try {
        const referrer = req.headers['referer'] || '';
        const frontendUrls = ['localhost:5173', 'daracheol.com', 'www.daracheol.com', 'daracheol-6adc.onrender.com'];
        const isFrontendVisit = frontendUrls.some(url => referrer.includes(url));
        const isAssetRequest = /\.(js|css|png|jpe?g|svg|ico|woff2?|ttf|map)$/i.test(req.path);
        const alreadyVisited = req.cookies?._visited;

        if (!isFrontendVisit || isAssetRequest || alreadyVisited || req.path === '/favicon.ico') return next();

        res.cookie('_visited', 'true', {
            maxAge: 10 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        const rawIP = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '';
        const ip = (rawIP === '::1' || rawIP === '127.0.0.1') ? '' : rawIP;

        // Alert cooldown to avoid flooding
        const now = Date.now();
        if (alertCooldown.get(ip) && now - alertCooldown.get(ip) < ALERT_TTL) return next();
        alertCooldown.set(ip, now);

        const geo = ip ? await getGeoData(ip) : null;
        const uaString = req.headers['user-agent'] || '';
        const ua = new UAParser(uaString);
        const browser = ua.getBrowser();
        const os = ua.getOS();
        const device = ua.getDevice();

        const clientHints = {
            brand: req.headers['sec-ch-ua'] || 'N/A',
            mobile: req.headers['sec-ch-ua-mobile'] || 'N/A',
            platform: req.headers['sec-ch-ua-platform'] || 'N/A',
        };

        const language = req.headers['accept-language']?.split(',')[0] || 'Unknown';
        const dnt = req.headers['dnt'] === '1' ? 'Yes' : 'No';

        const proxyHeaders = [
            'x-forwarded-for', 'x-real-ip', 'x-client-ip', 'x-forwarded',
            'forwarded-for', 'forwarded', 'via', 'x-proxy-id', 'proxy-connection'
        ].filter(h => req.headers[h]).map(h => `${h}: ${req.headers[h]}`);

        const queryParams = Object.keys(req.query).length > 0
            ? `\n*Query:* \`${escapeMarkdown(JSON.stringify(req.query))}\``
            : '';

        const message = `💀 *INTRUSION DETECTED* 💀\n\n` +
            `*A new target has entered the web\\.*\n\n` +
            `*Timestamp \\(UTC\\):* \`${new Date().toISOString()}\`\n` +
            `*Ingress Point:* \`${escapeMarkdown(req.path)}\`\n` +
            `*Origin Vector:* \`${escapeMarkdown(referrer || 'Direct/Covert')}\`${queryParams}\n\n` +

            `*Network Infiltration Vector:* \[${escapeMarkdown(geo?.query || ip || 'localhost')}\]\n` +
            ` • *Proxy/VPN:* ${geo?.proxy ? '🚨 *DETECTED*' : 'Negative'}\n` +
            ` • *ISP:* ${escapeMarkdown(geo?.isp || 'Unknown')}\n` +
            ` • *Org:* ${escapeMarkdown(geo?.org || 'Unknown')}\n` +
            ` • *ASN:* ${escapeMarkdown(geo?.as || 'Unknown')}\n\n` +

            `*Last Known Coordinates:*\n` +
            ` • *Location:* ${geo ? `${escapeMarkdown(geo.city)}, ${escapeMarkdown(geo.regionName)}, ${escapeMarkdown(geo.country)} ${getCountryFlag(geo.countryCode)}` : 'Untraceable'}\n` +
            ` • *Map:* ${geo ? `[View](https://www.google.com/maps?q=${geo.lat},${geo.lon})` : 'N/A'}\n` +
            ` • *Timezone:* ${escapeMarkdown(geo?.timezone || 'Unknown')}\n\n` +

            `*System Info:*\n` +
            ` • *OS:* ${escapeMarkdown(os.name || '')} ${escapeMarkdown(os.version || '')}\n` +
            ` • *Browser:* ${escapeMarkdown(browser.name || '')} ${escapeMarkdown(browser.version || '')}\n` +
            ` • *Device:* ${escapeMarkdown(getDeviceInfo(device))}\n` +
            ` • *Lang:* ${escapeMarkdown(language)}\n` +
            ` • *DNT:* ${escapeMarkdown(dnt)}\n\n` +

            `*Client Hints:*\n` +
            ` • *UA Brand:* \`${escapeMarkdown(clientHints.brand)}\`\n` +
            ` • *Mobile:* ${escapeMarkdown(clientHints.mobile)}\n` +
            ` • *Platform:* \`${escapeMarkdown(clientHints.platform)}\`\n\n` +

            `*Request Info:*\n` +
            ` • *Method:* ${escapeMarkdown(req.method)}\n` +
            ` • *Protocol:* ${escapeMarkdown(req.protocol?.toUpperCase() || 'HTTP')}\n` +
            (proxyHeaders.length > 0
                ? ` • *Proxy Headers:*\n\`\`\`\n${escapeMarkdown(proxyHeaders.join('\n'))}\n\`\`\``
                : '') +
            `\n\n*User Agent:*\n\`\`\`\n${escapeMarkdown(uaString)}\n\`\`\``;

        const chatId = process.env.TELEGRAM_CHAT_ID || '-1002508835850';

        // Fire-and-forget (non-blocking) send
        sendTelegramAlert(message, chatId).catch(err =>
            console.error('❌ Telegram alert failed:', err.message)
        );

    } catch (err) {
        console.error('🚨 trackVisit crash:', err.message);
    }

    next();
};
