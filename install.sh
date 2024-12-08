#!/bin/bash

# Check if the necessary tools (dialog and jq) are installed
if ! command -v dialog &>/dev/null || ! command -v jq &>/dev/null; then
	echo "This script requires 'dialog' and 'jq' for proper execution."
	read -p "Would you like to install them? (Default: Yes) [Y/n]: " response
	response=${response:-Y} # Default to 'Y' if no input

	if [[ "$response" =~ ^[Yy]$ ]]; then
		sudo apt update
		sudo apt install -y dialog jq
	else
		echo "Installation canceled. Exiting script."
		exit 1
	fi
fi

# Function to get the server's public IP address
get_public_ip() {
	IP=$(curl -s http://ipv4.icanhazip.com)
	echo "$IP"
}

# Function to install acme.sh and obtain SSL certificate
install_acme_and_get_cert() {
	dialog --infobox "Installing acme.sh..." 5 40
	git clone https://github.com/acmesh-official/acme.sh.git ~/.acme.sh
	~/.acme.sh/acme.sh --install
	dialog --infobox "Obtaining SSL certificate..." 5 40
	~/.acme.sh/acme.sh --issue --dns dns_cf -d "${SUBDOMAIN}.${DOMAIN}" \
		--key-file ./key.pem \
		--fullchain-file ./cert.pem \
		--accountemail "${ACCOUNT_EMAIL}"
}

# Clear the terminal before starting the dialog-based interface
clear

# Display a welcome message
dialog --title "Welcome" --msgbox "Simple RTMP Server Installer" 6 40

# Ask the user if they want to set up SSL/TLS for the server
if dialog --yesno "Do you want to set up SSL? (Using Cloudflare and acme.sh)" 7 50; then
	SSL_SETUP=true
else
	SSL_SETUP=false
fi

# If SSL setup is confirmed, gather further information
if [ "$SSL_SETUP" = true ]; then
	DOMAIN=$(dialog --inputbox "Enter your domain name (e.g. themeathon.com):" 8 50 3>&1 1>&2 2>&3)
	SUBDOMAIN=$(dialog --inputbox "Enter subdomain (e.g. us.rtmp):" 8 50 3>&1 1>&2 2>&3)
	ACCOUNT_EMAIL=$(dialog --inputbox "Enter your account email for SSL:" 8 50 3>&1 1>&2 2>&3)
	export CF_Token=$(dialog --inputbox "Enter your Cloudflare API token:" 8 50 3>&1 1>&2 2>&3)

	CONFIRM_MESSAGE="Please review your input:\n\n"
	CONFIRM_MESSAGE+="Domain: $DOMAIN\n"
	CONFIRM_MESSAGE+="Subdomain: $SUBDOMAIN\n"
	CONFIRM_MESSAGE+="Account Email: $ACCOUNT_EMAIL\n"
	CONFIRM_MESSAGE+="Cloudflare API Token: $CF_Token\n"

	# Confirm user inputs
	if dialog --yesno "$CONFIRM_MESSAGE\nDo you want to proceed with these entries?" 15 50; then
		:
	else
		dialog --msgbox "Installation aborted. Please rerun the script to input values again." 6 40
		exit 1
	fi

	# Fetch the public IPv4 address
	dialog --infobox "Fetching public IPv4 address..." 5 40
	PUBLIC_IP=$(get_public_ip)

	if [ -z "$PUBLIC_IP" ]; then
		dialog --msgbox "Error: Could not retrieve public IPv4 address." 6 40
		exit 1
	fi

	dialog --msgbox "Public IPv4 Address: $PUBLIC_IP" 6 40

	# Retrieve the Zone ID from Cloudflare using the provided Domain
	dialog --infobox "Retrieving Zone ID for domain: $DOMAIN..." 5 40
	ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}" \
		-H "Authorization: Bearer ${CF_Token}" \
		-H "Content-Type: application/json" | jq -r '.result[0].id')

	if [ -z "$ZONE_ID" ]; then
		dialog --msgbox "Error: Zone not found or API token is invalid." 6 40
		exit 1
	fi

	dialog --msgbox "Zone ID: $ZONE_ID" 6 40

	# Retrieve the DNS Record ID for the specified subdomain
	dialog --infobox "Retrieving DNS Record ID for subdomain: ${SUBDOMAIN}.${DOMAIN}..." 5 40
	DNS_RECORD_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?name=${SUBDOMAIN}.${DOMAIN}" \
		-H "Authorization: Bearer ${CF_Token}" \
		-H "Content-Type: application/json" | jq -r '.result[0].id')

	if [ -z "$DNS_RECORD_ID" ]; then
		dialog --msgbox "Error: DNS record not found. Please ensure it exists." 6 40
		exit 1
	fi

	dialog --msgbox "DNS Record ID: $DNS_RECORD_ID" 6 40

	# Check if DNS Record ID is valid, create or update DNS A Record accordingly
	if [[ -z "$DNS_RECORD_ID" || "$DNS_RECORD_ID" == "null" ]]; then
		dialog --infobox "Creating new DNS A Record..." 5 40
		RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
			-H "Authorization: Bearer ${CF_Token}" \
			-H "Content-Type: application/json" \
			--data "{
				\"type\": \"A\",
				\"name\": \"${SUBDOMAIN}\",
				\"content\": \"${PUBLIC_IP}\",
				\"ttl\": 120,
				\"proxied\": false
			}")
	else
		dialog --infobox "Updating existing DNS A Record..." 5 40
		RESPONSE=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${DNS_RECORD_ID}" \
			-H "Authorization: Bearer ${CF_Token}" \
			-H "Content-Type: application/json" \
			--data "{
				\"type\": \"A\",
				\"name\": \"${SUBDOMAIN}\",
				\"content\": \"${PUBLIC_IP}\",
				\"ttl\": 120,
				\"proxied\": false
			}")
	fi

	# Check Cloudflare API response and proceed with SSL installation if successful
	if echo "$RESPONSE" | jq -e '.success' >/dev/null; then
		dialog --msgbox "Successfully updated ${SUBDOMAIN}.${DOMAIN} to ${PUBLIC_IP}." 6 40
	else
		dialog --msgbox "Error: Failed to update DNS record.\nResponse from Cloudflare: $(echo $RESPONSE | jq -r '.errors[] | .message')" 6 40
		exit 1
	fi

	install_acme_and_get_cert
fi

# Enable color prompt in bash
dialog --infobox "Enabling color prompt in bash..." 5 40
sed -i 's/^#force_color_prompt=.*/force_color_prompt=yes/' ~/.bashrc

# Prompt for the web interface password and set default values
PASSWORD=$(dialog --inputbox "Enter the web interface password (default: admin):" 8 50 3>&1 1>&2 2>&3)
PASSWORD=${PASSWORD:-admin}
if [ "$SSL_SETUP" = true ]; then
	WEB_PORT=$(dialog --inputbox "Enter the web interface port (default: 443):" 8 50 3>&1 1>&2 2>&3)
	WEB_PORT=${WEB_PORT:-443}
else
	WEB_PORT=$(dialog --inputbox "Enter the web interface port (default: 80):" 8 50 3>&1 1>&2 2>&3)
	WEB_PORT=${WEB_PORT:-80}
fi

# Check if the user wants to install NVM and Node.js
if dialog --yesno "Do you want to install NVM and Node.js 20?" 7 50; then
	INSTALL_NVM=true
else
	INSTALL_NVM=false
fi

# Confirm the configuration settings and proceed
if dialog --yesno "The web interface password will be set to \"$PASSWORD\" and will run on port :$WEB_PORT. Do you want to proceed?" 7 50; then
	if [ "$INSTALL_NVM" = true ]; then
		# Install NVM if desired
		dialog --infobox "Installing NVM..." 5 40
		wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
		export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
		[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
		dialog --infobox "Installing Node.js version 20..." 5 40
		nvm install 20
	fi

	# Run the npm setup script
	dialog --infobox "Running npm setup script..." 5 40
	npm run setup

	# Install pm2 globally
	dialog --infobox "Installing pm2 globally..." 5 40
	npm install -g pm2

	# Configure the server environment and settings
	cd server
	cp .env.default .env
	sed -i "s/PASSWORD=admin/PASSWORD=$PASSWORD/" .env
	sed -i "s/WEB_PORT=3000/WEB_PORT=$WEB_PORT/" .env
	cd ..

	# Start the pm2 process
	pm2 start "npm start" --name "RTMP"

	# Save the pm2 process list
	pm2 save

	# Inform the user that setup is complete
	dialog --msgbox "Setup complete, and the server has been started!" 6 40
	dialog --msgbox "Web interface password set to \"$PASSWORD\" and web port set to :$WEB_PORT" 6 40

	# Restart the shell to ensure shell environment updates are sourced
	exec bash

	# Clean up the install script
	rm -f install.sh
else
	# If the user cancels, abort the installation
	dialog --msgbox "Installation aborted." 6 40
	exit 1
fi

# TODO: Only prompt for node 20 installation if it's not already found
