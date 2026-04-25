function sendResponse(res, statusCode, jsonData) {
    let status = statusCode < 400;
    return res.status(statusCode).json(
        {success: status, data: jsonData}
    )
}

module.exports = sendResponse;