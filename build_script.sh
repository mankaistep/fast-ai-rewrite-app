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
if [ -f .next/standalone/server.js ]; then
  cp .next/standalone/server.js temp_built/
elif [ -f server.js ]; then
  cp server.js temp_built/
else
  echo "Warning: server.js not found. Creating a basic server.js file."
  cat << EOF > temp_built/server.js
const next = require('next')
const http = require('http')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  http.createServer((req, res) => {
    handle(req, res)
  }).listen(process.env.PORT || 80, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:' + (process.env.PORT || 80))
  })
})
EOF
fi

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

# Install dependencies in the temp_built directory
cd temp_built
npm install --production
cd ..

# Create a start script
cat << EOF > temp_built/start.sh
#!/bin/bash
set -e

# Perform git pull
git pull

export NODE_ENV=production
export PORT=\${PORT:-80}
export HOST=\${HOST:-0.0.0.0}
node server.js
EOF
chmod +x temp_built/start.sh

# List contents of temp_built
echo "Contents of temp_built:"
ls -la temp_built
echo "Contents of temp_built/.next:"
ls -la temp_built/.next