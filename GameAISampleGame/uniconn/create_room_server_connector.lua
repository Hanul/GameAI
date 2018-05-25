local create_socket_server_connector = require "uniconn/create_socket_server_connector"

-- create_room_server_connector
return function(port, disconnected_handler)
	local connector = create_socket_server_connector(port, disconnected_handler)

	local waiting_send_infos = {}
	local enter_room_names = {}

	local super_reconnect = connector.reconnect
	connector.reconnect = function()
		super_reconnect()
		for index, room_name in pairs(enter_room_names) do
			connector.send("__ENTER_ROOM", room_name)
		end
		for index, send_info in pairs(waiting_send_infos) do
			connector.send(send_info.method_name, send_info.data, send_info.callback)
		end
		waiting_send_infos = {}
	end

	local super_send = connector.send
	connector.send = function(method_name, data, callback)
		if connector.is_connected() ~= true then
			table.insert(waiting_send_infos, {
				method_name = method_name,
				data = data,
				callback = callback
			})
		else
			super_send(method_name, data, callback)
		end
	end

	-- 룸 접속
	connector.enter_room = function(room_name)
		table.insert(enter_room_names, room_name)
		if connector.is_connected() == true then
			connector.send("__ENTER_ROOM", room_name)
		end
	end

	-- 룸 접속 종료
	connector.exit_room = function(room_name)
		if connector.is_connected() == true then
			connector.send("__EXIT_ROOM", room_name)
		end
		for index, value in pairs(enter_room_names) do
			if value == room_name then
				table.remove(room_name, index)
				break
			end
		end
	end

	return connector
end