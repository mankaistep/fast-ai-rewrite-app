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

# Check for server.js in various locations and copy it to temp_built
if [ -f .next/standalone/server.js ]; then
  cp .next/standalone/server.js temp_built/
elif [ -f .next/server.js ]; then
  cp .next/server.js temp_built/
elif [ -f server.js ]; then
  cp server.js temp_built/
else
  echo "Warning: server.js not found in expected locations. Creating a basic server.js file."
  cat << EOF > temp_built/server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 80
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(\`> Ready on http://\${hostname}:\${port}\`)
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

# Remove .next from .gitignore
sed -i '/^\/\.next/d' temp_built/.gitignore

# Install sharp in the temp_built directory
cd temp_built
npm install sharp
npm install next  # Ensure next is installed
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