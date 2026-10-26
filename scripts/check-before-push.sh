#!/usr/bin/env bash
# Public-safety scan before pushing. Run: bash scripts/check-before-push.sh
# Exit 1 when something must not be public.
# Client / company words: put one regex per line in .client-words (gitignored, never committed).
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1
fail=0
hit() { echo "❌ $1"; fail=1; }

# 1. Secret / output files tracked by git
git ls-files | grep -E '(^|/)\.env$|/\.auth/|\.webm$|(^|/)reports/|(^|/)test-results/|/raw/.*\.(xlsx|pdf|csv|docx)$' && hit "Secret / output files are tracked (list above)"

# 2. Client / company words (local list)
if [ -f .client-words ]; then
  words=$(grep -v '^\s*#' .client-words | grep -v '^\s*$' | paste -sd '|' -)
  if [ -n "$words" ]; then
    git grep -n -i -E "$words" -- . && hit "Client / company words found (list above)"
    git log --all --format='%H %s%n%b' | grep -i -E "$words" && hit "Client / company words in commit messages"
  fi
else
  echo "ℹ️  No .client-words file — client-word scan skipped"
fi

# 3. Tokens / passwords in common formats
git grep -n -E '(eyJ[A-Za-z0-9_-]{20,}\.|PASSWORD=[^<[:space:]]+|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY)' -- . ':!*.env.example' ':!scripts/check-before-push.sh' && hit "Token / password-like strings (list above)"

# 4. History must be clean as well
git log --all --name-only --format= | grep -E '(^|/)\.env$|/\.auth/|\.webm$' | sort -u | grep . && hit "Git history contains .env / .auth / videos — publish a new repository, not the old history"

# 5. Size
size=$(du -sm .git | cut -f1)
[ "$size" -gt 100 ] && hit ".git is ${size} MB — look for videos / reports"

[ $fail -eq 0 ] && echo "✅ Clean, safe to push."
exit $fail
