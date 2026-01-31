const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dns = require('dns');

// Custom Resolver using Google DNS
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS

// Manually parse .env
const envPath = path.resolve(__dirname, '../.env');
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            process.env[key] = value;
        }
    });
} catch (e) {
    console.error('Failed to read .env:', e);
}

const resolveHost = (host) => {
    return new Promise((resolve, reject) => {
        resolver.resolve4(host, (err, addresses) => {
            if (err) return reject(err);
            resolve(addresses[0]);
        });
    });
};

const run = async () => {
    const originalUrl = process.env.DATABASE_URL;
    if (!originalUrl) {
        console.error('DATABASE_URL missing');
        process.exit(1);
    }
    
    try {
        const parsedUrl = new URL(originalUrl);
        const host = parsedUrl.hostname;
        
        console.log(`Resolving ${host} using Google DNS...`);
        const ip = await resolveHost(host);
        console.log(`Resolved to: ${ip}`);
        
        // Construct new URL with IP
        parsedUrl.hostname = ip;
        const connectionString = parsedUrl.toString();
        
        console.log("Connecting to database IP...");
        const pool = new Pool({
            connectionString, // Use IP-based URL
            ssl: { rejectUnauthorized: false }, 
            connectionTimeoutMillis: 10000, 
        });

        const client = await pool.connect();
        console.log("Successfully connected!");
        const res = await client.query('SELECT NOW()');
        console.log("Database time:", res.rows[0].now);
        client.release();
        process.exit(0);

    } catch (err) {
        console.error("Failed:", err.message);
        process.exit(1);
    }
};

run();
