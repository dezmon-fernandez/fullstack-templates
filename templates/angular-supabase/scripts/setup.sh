#!/usr/bin/env bash
set -euo pipefail

echo "Setting up project..."

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Start Supabase
echo "Starting Supabase..."
supabase start

# Extract credentials and write environment.development.ts
echo "Writing environment.development.ts..."
API_URL=$(supabase status -o env | grep '^API_URL=' | cut -d= -f2-)
ANON_KEY=$(supabase status -o env | grep '^PUBLISHABLE_KEY=' | cut -d= -f2-)

cat > src/environments/environment.development.ts <<EOF
export const environment = {
  production: false,
  supabaseUrl: '${API_URL}',
  supabaseKey: '${ANON_KEY}',
};
EOF

echo "Setup complete!"
echo ""
echo "Run 'pnpm dev' to start the dev server."
