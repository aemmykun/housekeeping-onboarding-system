const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
console.log('URI:', process.env.MONGODB_URI);
console.log('Password Part:', process.env.MONGODB_URI.split(':')[2].split('@')[0]);
