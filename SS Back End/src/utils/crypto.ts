import crypto from 'crypto';

export default function generateUid(x: number) {
    const uidBytes = crypto.randomBytes(x);
    return uidBytes.toString('hex');
}


