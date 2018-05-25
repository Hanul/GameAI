local tcp_client = require "defnet.tcp_client"
local json = require "uniconn/json"

-- create_socket_server_connector
return function(port, disconnected_handler)
	local connector = {}

	local host
	local client
	local method_handler_map = {}
	local send_key = 0
	
	-- 접속 끊기
	connector.disconnect = function()
		if is_connected == true then
			client.destroy()
		end
	end

	-- 재접속
	connector.reconnect = function()
		connector.disconnect()
		
		client = tcp_client.create(host, port,
		-- 데이터 수신
		function(received_str)
			local params = json.decode(received_str)
			if params ~= nil then
				local method_handlers = method_handler_map[params.methodName]
				if method_handlers ~= nil then
					for index, method_handler in pairs(method_handlers) do
						method_handler(params.data, function(ret_data)
							if params.sendKey ~= nil then
								connector.send("__CALLBACK_"..params.sendKey, ret_data)
							end
						end)
					end
				end
			end
		end,
		-- 접속이 끊어짐
		function()
			disconnected_handler()
			client = nil
		end)
	end

	-- 접속하기
	connector.connect = function(_host)
		host = _host
		connector.reconnect()
	end

	-- 접속 끊기
	connector.disconnect = function()
		if connector.is_connected() == true then
			client.destroy()
		end
		client = nil
	end

	-- 접속 확인
	connector.is_connected = function()
		return client ~= nil
	end

	connector.on = function(method_name, method_handler)
		local method_handlers = method_handler_map[method_name]
		if method_handlers == nil then
			method_handlers = {}
			method_handler_map[method_name] = method_handlers
		end
		table.insert(method_handlers, method_handler)
	end

	connector.off = function(method_name, method_handler)
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

	connector.send = function(method_name, data, callback)
		if connector.is_connected() == true then
			client.send(json.encode({
				methodName = method_name,
				data = data,
				sendKey = send_key
			}).."\r\n")
			if callback ~= nil then
				local callback_name = "__CALLBACK_"..send_key
				connector.on(callback_name, function(data)
					callback(data)
					connector.off(callback_name)
				end)
			end
			send_key = send_key + 1
		end
	end

	-- 업데이트
	connector.update = function()
		if connector.is_connected() == true then
			client.update()
		end
	end

	return connector
end