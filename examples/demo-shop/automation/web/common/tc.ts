import fs from 'fs';
import path from 'path';

/**
 * Generated specs pin the TC revision they were generated from. The TC file changed (new revision / not LOCKED)
 * → stop before touching the app: regenerate with `npm run gen` (R42).
 * tcFile is relative to examples/demo-shop/ (the project root).
 */
export function assertTcRevision(tcFile: string, revision: number): void {
  const file = path.resolve(__dirname, '../../..', tcFile);
  const head = fs.readFileSync(file, 'utf8').match(/State: (\w+) · Revision: (\d+)/);
  if (head?.[1] !== 'LOCKED') throw new Error(`${tcFile}: State is ${head?.[1] ?? '?'}, not LOCKED — automation only runs LOCKED test cases.`);
  if (Number(head[2]) !== revision) throw new Error(`${tcFile} is now rev ${head[2]}, the spec was generated from rev ${revision}. Run: npm run gen`);
}
