-- create_room
return function(connector, box_name, name)
	local room = {}

	local room_name = box_name.."/"..name
	local method_handler_map = {}
	local is_exited = false

	connector.enter_room(room_name)

	room.on = function(method_name, method_handler)
		local method_handlers = method_handler_map[method_name]
		connector.on(room_name.."/"..method_name, method_handler)
		if method_handlers == nil then
			method_handlers = {}
			method_handler_map[method_name] = method_handlers
		end
		table.insert(method_handlers, method_handler)
	end

	room.off = function(method_name, method_handler)
		connector.off(room_name.."/"..method_name, method_handler)
		if method_handler == nil then
			method_handler_map[method_name] = nil
		else
			local method_handlers = method_handler_map[method_name]
			for index, value in pairs(method_handlers) do
				if value == method_handler then
					table.remove(method_handlers, index)
					break
				end
			end
			if table.getn(method_handlers) == 0 then
				connector.off(method_name)
			end
		end
	end

	room.send = function(method_name, data, callback)
		if is_exited ~= true then
			connector.send(room_name.."/"..method_name, data, callback);
		end
	end

	room.exit = function()
		if is_exited ~= true then
			connector.exit_room(room_name)
			for method_name, method_handlers in pairs(method_handler_map) do
				for index, method_handler in pairs(method_handlers) do
					connector.off(method_name, method_handlers)
				end
			end
			method_handler_map = nil
			is_exited = true
		end
	end

	return room
end