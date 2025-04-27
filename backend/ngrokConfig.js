const ngrok = require('ngrok');

async function startNgrok(port) {
    try {
        const url = await ngrok.connect({
            addr: port,
            authtoken: process.env.NGROK_AUTH_TOKEN,
            subdomain: 'infinite-loopers'  // Specific subdomain
        });
        console.log('🌍 Ngrok URL:', url);
        return url;
    } catch (err) {
        console.error('Ngrok Error:', err);
        console.error('Make sure you have:');
        console.error('1. A paid ngrok account');
        console.error('2. Correct authtoken in .env');
        console.error('3. Subdomain is available');
        process.exit(1);
    }
}

module.exports = startNgrok;