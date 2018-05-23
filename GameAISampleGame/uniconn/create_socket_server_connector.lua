local tcp_client = require "defnet.tcp_client"

-- create_socket_server_connector
return function(ip, port)
	local connector = {}

	local client = tcp_client.create(ip, port, function(data)
		print("TCP client received data " .. data)
	end,
	function()
		print("On disconnected")
		client = nil
	end)

	-- 업데이트
	function connector.update()
		client.update()
	end

	-- 제거
	function connector.destroy()
		client.destroy()
	end

	return connector
end