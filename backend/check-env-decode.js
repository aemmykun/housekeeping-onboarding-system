const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const uri = process.env.MONGODB_URI;
const decodedUri = decodeURIComponent(uri);
console.log('Decoded URI (hidden pass):', decodedUri.replace(/:([^@]+)@/, ':****@'));
console.log('Raw Password:', uri.split(':')[2].split('@')[0]);
console.log('Decoded Password:', decodeURIComponent(uri.split(':')[2].split('@')[0]));
