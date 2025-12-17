#!/bin/bash

# Copy this template to a new directory for testing
# Usage: ./copy-template.sh ../my-new-app

if [ -z "$1" ]; then
  echo "Usage: ./copy-template.sh <destination>"
  echo "Example: ./copy-template.sh ../my-test-app"
  exit 1
fi

DEST="$1"

if [ -d "$DEST" ]; then
  echo "Error: $DEST already exists"
  exit 1
fi

mkdir -p "$DEST"

# Copy everything except .git and node_modules
rsync -av --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='copy-template.sh' . "$DEST/"

echo ""
echo "Template copied to $DEST"
echo ""
echo "Next steps:"
echo "  cd $DEST"
echo "  git init"
echo "  supabase start"
echo "  cp .env.example .env.local"
echo "  # Add your Supabase URL + publishable key to .env.local"
echo "  /generate-react-supabase-prp \"your app idea\""
