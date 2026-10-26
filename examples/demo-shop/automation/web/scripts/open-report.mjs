// Open the HTML report of the latest run (or of a given folder: npm run report -- reports/Runs/<run>).
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = path.resolve(process.cwd(), 'reports', 'Runs');
let dir = process.argv[2];
if (!dir) {
  const runs = fs.existsSync(root)
    ? fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, 'html')))
      .sort((a, b) => fs.statSync(path.join(root, a)).mtimeMs - fs.statSync(path.join(root, b)).mtimeMs)
    : [];
  if (!runs.length) {
    console.error('No report in reports/Runs/ yet. Run npm test first.');
    process.exit(1);
  }
  dir = path.join(root, runs[runs.length - 1]);
}
execSync(`npx playwright show-report "${path.join(dir, 'html')}"`, { stdio: 'inherit' });
