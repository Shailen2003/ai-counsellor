const dns = require('dns');
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8']);

const regions = [
    'aws-0-ap-south-1.pooler.supabase.com', // Mumbai (likely)
    'aws-0-us-east-1.pooler.supabase.com',  // N. Virginia
    'aws-0-eu-central-1.pooler.supabase.com' // Frankfurt
];

regions.forEach(domain => {
    resolver.resolve4(domain, (err, addresses) => {
        if (err) {
            console.log(`${domain}: NO IPv4`);
        } else {
            console.log(`${domain}: IPv4 FOUND -> ${addresses}`);
        }
    });
});
