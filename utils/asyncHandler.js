const asyncHandler = (requestHandle) => (req, res, next) => {
    Promise.resolve(requestHandle(req, res, next)).catch((err) => console.log('error :', err));
}

module.exports = asyncHandler;
