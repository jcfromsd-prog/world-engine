import fs from 'fs';
const spec = JSON.parse(fs.readFileSync('openapi-spec.json', 'utf8'));

fs.writeFileSync('supa-out.json', JSON.stringify({
    submissions: spec.definitions.submissions.properties,
    reputation_ledger: spec.definitions.reputation_ledger.properties
}, null, 2));
