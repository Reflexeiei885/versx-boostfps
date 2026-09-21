import { Buffer } from 'buffer';
import { verifyKey } from 'discord-interactions';

const KEYAUTH_URL = 'https://keyauth.win/api/1.3/';
const KEYAUTH_PUBLIC_KEY = '4c857006c10dfff62ed08b37d2ddf177cbdc61021b9d9ed046af25b8bcbe2fae';
const APP = {
  name: process.env.KEYAUTH_NAME || 'boostfps-VesrX',
  ownerid: process.env.KEYAUTH_OWNERID || 'igr22xSE8H',
  version: process.env.KEYAUTH_VERSION || '1.0',
};

async function keyAuthRequest(data) {
  const response = await fetch(KEYAUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(data).toString(),
  });
  if (!response.ok) throw new Error(`KeyAuth HTTP ${response.status}`);
  const responseData = await response.json();
  const signature = response.headers.get('x-signature-ed25519');
  const timestamp = response.headers.get('x-signature-timestamp');
  if (!signature || !timestamp) throw new Error('KeyAuth response signature is missing.');
  if (!verifyKey(Buffer.from(JSON.stringify(responseData), 'utf-8'), signature, timestamp, KEYAUTH_PUBLIC_KEY)) {
    throw new Error('KeyAuth response signature verification failed.');
  }
  return responseData;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed.' });
  try {
    const { action, license, hwid } = req.body || {};
    if (action !== 'license') return res.status(400).json({ success: false, message: 'Unsupported authentication action.' });
    const key = String(license || '').trim();
    const browserHwid = String(hwid || '').trim();
    if (!key) return res.status(400).json({ success: false, message: 'Please enter a license key.' });
    if (!browserHwid || browserHwid.length > 256) return res.status(400).json({ success: false, message: 'Invalid browser identifier.' });

    const init = await keyAuthRequest({ type: 'init', name: APP.name, ownerid: APP.ownerid, version: APP.version });
    if (!init?.success || !init?.sessionid) return res.status(401).json({ success: false, message: init?.message || 'KeyAuth initialization failed.' });

    const result = await keyAuthRequest({ type: 'license', name: APP.name, ownerid: APP.ownerid, sessionid: init.sessionid, key, hwid: browserHwid });
    if (!result?.success) return res.status(401).json({ success: false, message: result?.message || 'Invalid license key.' });

    const info = result.info || {};
    return res.status(200).json({
      success: true,
      message: result.message || 'License authenticated successfully.',
      user: {
        username: info.username || '',
        hwid: info.hwid || browserHwid,
        expires: info.subscriptions?.[0]?.expiry || null,
        subscription: info.subscriptions?.[0]?.subscription || '',
        subscriptions: info.subscriptions || [],
        createdate: info.createdate || null,
        lastlogin: info.lastlogin || null,
      },
    });
  } catch (error) {
    console.error('[KeyAuth]', error);
    return res.status(500).json({ success: false, message: 'Authentication service error.' });
  }
}
