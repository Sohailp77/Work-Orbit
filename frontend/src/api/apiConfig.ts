// // // src/config/constants.ts

// // export const BASE_URL = 'http://10.190.74.35:8080';
// export const BASE_URL = 'http://192.168.10.125:8081';



const BACKEND_IP_MAP = {
    '192.168.10': 'http://192.168.10.125:8081',
    '10.190.74': 'http://10.190.74.125:8081',
    '10.155.160': 'http://10.155.160.253:8081',
};

const hostname = window.location.hostname;
const octets = hostname.split('.');

// Handle only IPv4
let subnet = '';
if (octets.length === 4) {
    subnet = `${octets[0]}.${octets[1]}.${octets[2]}`;
}

let selectedUrl = BACKEND_IP_MAP[subnet];

// Fallback
if (!selectedUrl) {
    selectedUrl = 'http://10.190.74.125:8081'; // Default backend
    console.warn('⚠️ Unknown subnet:', subnet, 'Using default backend:', selectedUrl);
}

export const BASE_URL = selectedUrl;

