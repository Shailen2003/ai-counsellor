const dns = require('dns');
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8']);

// Construct the Supabase Pooler-specific alias for this project
// Format: [project-ref].pooler.supabase.com
const projectRef = 'xnzmtvhrxpxfpksqmkki';
const domain = `${projectRef}.pooler.supabase.com`;

console.log(`Testing resolution for: ${domain}`);

resolver.resolve4(domain, (err, addresses) => {
    if (err) {
        console.log(`IPv4 FAIL: ${err.message}`);
    } else {
        console.log(`IPv4 SUCCESS: ${addresses}`);
    }
});
