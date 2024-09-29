#!/bin/bash

# Run Next.js build
npm run build

# Create a temporary directory for the built files
mkdir -p temp_built

# Copy standalone build to the temporary directory
cp -R .next/standalone/* temp_built/
cp -R .next/static temp_built/.next/
cp package.json temp_built/

# Copy public folder if it exists
if [ -d "public" ]; then
  cp -R public temp_built/
fi

# Create a .gitignore file for Repo Built
echo "node_modules" > temp_built/.gitignore
echo ".env" >> temp_built/.gitignore

# Create a start script
echo "#!/bin/bash" > temp_built/start.sh
echo "PORT=\${PORT:-3000}" >> temp_built/start.sh
echo "HOST=\${HOST:-localhost}" >> temp_built/start.sh
echo "node server.js" >> temp_built/start.sh
chmod +x temp_built/start.sh