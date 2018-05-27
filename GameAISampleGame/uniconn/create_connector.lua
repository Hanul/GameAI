local create_room_server_connector = require "uniconn/create_room_server_connector"

-- create_connector
return function(door_host, is_secure, web_server_port, socket_server_port, disconnected_handler)
	local connector = create_room_server_connector(socket_server_port, disconnected_handler)

	local url
	if is_secure == true then
		url = "https://"
	else
		url = "http://"
	end
	url = url..door_host..":"..web_server_port.."/__SOCKET_SERVER_HOST?defaultHost="..door_host

	http.request(url, "GET", function(self, _, response)
		connector.connect(response.response)
	end)

	return connector
end