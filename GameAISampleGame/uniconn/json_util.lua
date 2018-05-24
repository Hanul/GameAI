local json = require "uniconn/json"

-- json_util
local M = {}

function M.parse(str)
	return json.decode(str)
end

function M.stringify(table)
	return json.encode(table)
end

return M