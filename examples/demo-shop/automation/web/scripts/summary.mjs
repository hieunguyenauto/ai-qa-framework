// Print SUMMARY.md of the latest run (or of a given folder: npm run summary -- reports/Runs/<run>).
import fs from 'fs';
import path from 'path';
const root = path.resolve(process.cwd(), 'reports', 'Runs');
let dir = process.argv[2];
if (!dir) {
  const runs = fs.existsSync(root) ? fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, 'SUMMARY.md')))
    .sort((a, b) => fs.statSync(path.join(root, a)).mtimeMs - fs.statSync(path.join(root, b)).mtimeMs) : [];
  if (!runs.length) { console.error('No SUMMARY.md in reports/Runs/ yet. Run the tests first.'); process.exit(1); }
  dir = path.join(root, runs[runs.length - 1]);
}
console.log(`Folder: ${path.relative(process.cwd(), dir)}\n`);
console.log(fs.readFileSync(path.join(dir, 'SUMMARY.md'), 'utf8'));
console.log('Other folders: reports/Passed · reports/Failed · history: reports/HISTORY.md');
