import dns from "dns/promises";

const PRIVATE_BLACKLIST = [
    "127.0.0.1",
    "10.",
    "192.168",
    "169.254",
    "::1",
    "fe80:",
    "fc",
    "fd",
];

function isPrivateIP(ip: string) {
    if (PRIVATE_BLACKLIST.some(a => ip.startsWith(a))) return true;

    const parts = ip.split('.').map(Number);
    return parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31;
}

export async function isPublicHost(hostname: string) {
    const records = await dns.lookup(hostname, { all: true });

    for (const r of records) {
        if (isPrivateIP(r.address)) return false;
    }

    return true;
}