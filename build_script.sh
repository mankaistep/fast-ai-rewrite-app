#!/bin/bash
set -x  # Enable debug mode

# Run Next.js build
npm run build

# Print current directory and list contents
pwd
ls -la

# Create a temporary directory for the built files
mkdir -p temp_built

# Copy the entire .next folder, including the standalone and other content
cp -R .next temp_built/

# Copy standalone build to the temporary directory
cp -R .next/standalone/* temp_built/

# Ensure server.js is in the root
if [ -f temp_built/.next/standalone/server.js ]; then
  mv temp_built/.next/standalone/server.js temp_built/
fi

# Copy the package.json to the temporary directory
cp package.json temp_built/

# Copy the Prisma folder (assuming it's named 'prisma')
if [ -d "prisma" ]; then
  cp -R prisma temp_built/
fi

# Copy public folder if it exists
if [ -d "public" ]; then
  cp -R public temp_built/
fi

# Create a .gitignore file for Repo Built
echo "node_modules" > temp_built/.gitignore
echo ".env" >> temp_built/.gitignore

# Remove .next from .gitignore
sed -i '/^\/\.next/d' temp_built/.gitignore

# Install only necessary dependencies in the temp_built directory
cd temp_built
# Install dependencies, excluding node_modules in the main directory
npm install --production
cd ..

# Create a start script
cat << EOF > temp_built/start.sh
#!/bin/bash
set -e

# Perform git pull
git pull

export NODE_ENV=production
export PORT=${PORT:-80}
export HOST=\${HOST:-0.0.0.0}
node server.js
EOF
chmod +x temp_built/start.sh

# List contents of temp_built
echo "Contents of temp_built:"
ls -la temp_built
echo "Contents of temp_built/.next:"
ls -la temp_built/.next