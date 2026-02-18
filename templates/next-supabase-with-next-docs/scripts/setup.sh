#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Setting up project..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Start Supabase
echo "🗄️  Starting Supabase..."
supabase start

# Write .env.local with dynamic credentials
echo "🔑 Writing .env.local..."
supabase status -o env | sed -n \
  -e 's/^API_URL=/NEXT_PUBLIC_SUPABASE_URL=/p' \
  -e 's/^PUBLISHABLE_KEY=/NEXT_PUBLIC_SUPABASE_ANON_KEY=/p' \
  -e 's/^SECRET_KEY=/SUPABASE_SERVICE_ROLE_KEY=/p' \
  > .env.local

echo "✅ Setup complete!"
echo ""
echo "Run 'pnpm dev' to start the dev server."
