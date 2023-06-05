const { response } = require("express")

class Error_handeling {

    Success(message, data) {
        return {
            message: message,
            data: data,
            status: 200,
            success: true
        }
    }
    error_Bad_request(message, data) {
        return {
            message: message,
            data: data,
            status: 400,
            success: false
        }
    }
    Unauthorized_response(message, data) {
        return {
            message: message,
            data: data,
            status: 401,
            success: false
        }
    }
    Internal_Server_Error(message, data) {
        return {
            message: message,
            data: data,
            status: 500,
            success: false
        }
    }
    Not_Found_Error(message, data) {
        return {
            message: message,
            data: data,
            status: 404,
            success: false
        }
    }
    Already_Occupied_Error(message, data) {
        return {
            message: message,
            data: data,
            status: 403,
            success: false
        }
    }
}
module.exports = new Error_handeling()

