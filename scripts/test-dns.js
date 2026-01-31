const dns = require('dns');

const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8']);

const domain = 'db.xnzmtvhrxpxfpksqmkki.supabase.co';

console.log(`Resolving ${domain} using 8.8.8.8...`);

resolver.resolve4(domain, (err, addresses) => {
    if (err) {
        console.error('IPv4 FAIL:', err.message);
    } else {
        console.log('IPv4 SUCCESS:', addresses);
    }
});
