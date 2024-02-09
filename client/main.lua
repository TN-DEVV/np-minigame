local p = nil
local function character(cb, time)
    if time == nil or time < 1 then time = 10 end
    p = promise.new()
    SendNUIMessage({
        action = 'start',
		time = time,
    })
    SetNuiFocus(true, false)
    local result = Citizen.Await(p)
    cb(result)
end
exports("character", character)

RegisterNUICallback('result', function(data, cb)
    p:resolve(data.result)
    p = nil
    SetNuiFocus(false, false)
    cb('ok')
end)

-- RegisterCommand("ttt", function(source, args)
--     character(function(success)
--         if success then
--             print("success")
--         else
--             print("fail")
--         end
--     end)
-- end, false)