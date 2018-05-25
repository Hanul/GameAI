local create_room = require "uniconn/create_room"

-- create_model
return function(connector, box_name, name)
	local model = {}

	local room = create_room(connector, box_name, name)

	model.get_name = function()
		return name
	end

	model.get_room = function()
		return room
	end

	model.create = function(data, error_handler, not_valid_handler, not_authed_handler, callback)
		room.send("create", data, function(result)
			if result.errorMsg ~= nil then
				error_handler(result.errorMsg)
			elseif result.validErrors ~= nil then
				not_valid_handler(result.validErrors)
			elseif result.isNotAuthed == true then
				not_authed_handler()
			else
				callback(result.savedData)
			end
		end)
	end

	model.get = function(id_or_params, error_handler, not_authed_handler, not_exists_handler, callback)
		room.send("get", id_or_params, function(result)
			if result.errorMsg ~= nil then
				error_handler(result.errorMsg)
			elseif result.isNotAuthed == true then
				not_authed_handler()
			elseif result.savedData == nil then
				not_exists_handler()
			else
				callback(result.savedData)
			end
		end)
	end

	model.update = function(data, error_handler, not_valid_handler, not_authed_handler, not_exists_handler, callback)
		room.send("update", data, function(result)
			if result.errorMsg ~= nil then
				error_handler(result.errorMsg)
			elseif result.validErrors ~= nil then
				not_exists_handler(result.validErrors)
			elseif result.isNotAuthed == true then
				not_authed_handler()
			elseif result.savedData == nil then
				not_exists_handler()
			else
				callback(result.savedData)
			end
		end)
	end

	model.remove = function(id, error_handler, not_authed_handler, not_exists_handler, callback)
		room.send("remove", id, function(result)
			if result.errorMsg ~= nil then
				error_handler(result.errorMsg)
			elseif result.isNotAuthed == true then
				not_authed_handler()
			elseif result.originData == nil then
				not_exists_handler()
			else
				callback(result.originData)
			end
		end)
	end

	model.find = function(params, error_handler, not_authed_handler, callback)
		room.send("find", params, function(result)
			if result.errorMsg ~= nil then
				error_handler(result.errorMsg)
			elseif result.isNotAuthed == true then
				not_authed_handler()
			else
				callback(result.savedDataSet)
			end
		end)
	end

	model.count = function(params, error_handler, not_authed_handler, callback)
		room.send("count", params, function(result)
			if result.errorMsg ~= nil then
				error_handler(result.errorMsg)
			elseif result.isNotAuthed == true then
				not_authed_handler()
			else
				callback(result.count)
			end
		end)
	end

	model.exists = function(params, error_handler, not_authed_handler, callback)
		room.send("exists", params, function(result)
			if result.errorMsg ~= nil then
				error_handler(result.errorMsg)
			elseif result.isNotAuthed == true then
				not_authed_handler()
			else
				callback(result.exists)
			end
		end)
	end

	return model
end