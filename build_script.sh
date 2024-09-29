#!/bin/bash

# Run Next.js build
npm run build

# Create a temporary directory for the built files
mkdir -p temp_built

# Copy standalone build to the temporary directory
cp -R .next/standalone/* temp_built/

# Create .next directory and copy required files
mkdir -p temp_built/.next
cp -R .next/static temp_built/.next/
cp -R .next/standalone/.next/routes temp_built/.next/
cp -R .next/standalone/.next/server temp_built/.next/
cp -R .next/standalone/.next/build-manifest.json temp_built/.next/
cp -R .next/standalone/.next/react-loadable-manifest.json temp_built/.next/

cp package.json temp_built/

# Copy public folder if it exists
if [ -d "public" ]; then
  cp -R public temp_built/
fi

# Create a .gitignore file for Repo Built
echo "node_modules" > temp_built/.gitignore
echo ".env" >> temp_built/.gitignore

# Create a start script
cat << EOF > temp_built/start.sh
#!/bin/bash
export NODE_ENV=production
export PORT=\${PORT:-3000}
export HOST=\${HOST:-0.0.0.0}
node server.js
EOF
chmod +x temp_built/start.sh