# simple-rtmp-server
A simple RTMP server using NestJS, Vue and node-media-server

To get started, clone this repository and run the `install.sh` script.  
Afterwards the server will be running as a pm2 process called `RTMP`.

Please keep in mind that the install script is very tailor made to a quick deploy on a server.  
It has SSL support as well, either by providing the files manually in the main folder (key.pem and cert.pem) or automated through Cloudflare DNS and acme.sh.

```bash
git clone https://github.com/Lordmau5/simple-rtmp-server
cd simple-rtmp-server
chmod +x install.sh
./install.sh

# Everything is installed, the server is now active as well.
# To configure the stream keys head on over to the admin interface at http://<ip>:3000/
# To stream to the server, create a stream key and then stream to rtmp://<ip>/live/<stream_key>

# If you want to provide an HTTPS connection please use another service like nginx and proxy the connection internally.

# To check on the server run the following
pm2 logs RTMP

# To stop the server
pm2 stop RTMP

# To start it again
pm2 start RTMP

# And to restart
pm2 restart RTMP

# If you want to change the admin interface password you have to edit the following file
server/.env

# In it you need to change the line that says PASSWORD= to be whatever you want it to be for the web interface
```