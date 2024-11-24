#!/bin/bash

# Capture the password argument if provided
PASSWORD=${1:-admin} # Default to 'admin' if no argument is passed

# Prompt user for confirmation
echo "This script will install NVM, Node 20, and pm2."
echo "The password will be set to: ${1:-admin}. Do you want to proceed? (Y/N) [Default: Y]"
read -r RESPONSE

# Set default response to 'Y' if no input is provided
RESPONSE=${RESPONSE:-Y}

if [[ ! "$RESPONSE" =~ ^[Yy]$ ]]; then
  echo "Installation aborted."
  exit 1
fi

# Install NVM
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Add and load NVM
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

# Install node 20
nvm install 20

# Run the setup
npm run setup

# Install pm2 globally
npm install -g pm2

# Source .bashrc and export path to make pm2 available now
source ~/.bashrc
export PATH="$PATH:$HOME/.nvm/versions/node/$(nvm version)/bin"

# Make pm2 start on system startup
pm2 startup

# Copy default .env file and set password
cd server
cp .env.default .env
sed -i "s/PASSWORD=admin/PASSWORD=$PASSWORD/" .env

# Go back to project root
cd ..

# Start the server as a PM2 instance
pm2 start "npm start" --name "RTMP"

# Save the process just in case the server reboots
pm2 save

# Final message
echo "Setup complete, and the server has been started! Password set to: $PASSWORD"
echo "It is suggested to log out and back in for full functionality."
