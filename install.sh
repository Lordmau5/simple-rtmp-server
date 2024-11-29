#!/bin/bash

# Set password and web interface port with defaults
read -rp "Enter the web interface password (default: admin): " PASSWORD
PASSWORD=${PASSWORD:-admin}
read -rp "Enter the web interface port (default: 3000): " WEB_PORT
WEB_PORT=${WEB_PORT:-3000}

# Inform user about the installation process and password
echo "This script will install Node 20 and pm2."
echo "The web interface password will be set to \"$PASSWORD\" and will run on port :$WEB_PORT. Do you want to proceed? (Y/n)"
read -r RESPONSE
RESPONSE=${RESPONSE:-Y}  # Default response is 'Y' if not provided

# Check if user wants to proceed with installation
if [[ ! "$RESPONSE" =~ ^[Yy]$ ]]; then
	echo "Installation aborted."
	exit 1
fi

# Enable color prompt in bash
sed -i 's/^#force_color_prompt=.*/force_color_prompt=yes/' ~/.bashrc

# Install NVM (Node Version Manager)
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"  # Set NVM directory
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load NVM if installed
nvm install 20  # Install Node.js version 20

# Run npm setup script
npm run setup

# Install pm2 globally
npm install -g pm2

# Navigate to server directory
cd server
# Copy default environment config
cp .env.default .env
# Update password and web port in environment file
sed -i "s/PASSWORD=admin/PASSWORD=$PASSWORD/" .env
sed -i "s/WEB_PORT=3000/WEB_PORT=$WEB_PORT/" .env
cd ..  # Return to previous directory

# Start the application using pm2
pm2 start "npm start" --name "RTMP"
pm2 save  # Save pm2 process list

# Inform user that setup is complete
echo "Setup complete, and the server has been started!"
echo "Web interface password set to \"$PASSWORD\" and web port set to :$WEB_PORT"

# Reload the bash configuration to use the new settings
exec bash

# Remove the install script
rm -f install.sh