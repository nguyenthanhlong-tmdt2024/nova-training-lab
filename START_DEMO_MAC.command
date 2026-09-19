#!/bin/bash
cd "$(dirname "$0")"
if node -e "fetch('http://localhost:3000').then(r=>r.text()).then(t=>process.exit(t.includes('NOVA TRAINING LAB')?0:1)).catch(()=>process.exit(1))"; then
  open http://localhost:3000
  exit 0
fi
open http://localhost:3000
npm run dev -- --port 3000
