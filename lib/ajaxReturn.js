/**
 * AJAX plugin
 */
module.exports = (req, res, next) => {
    /**
     *
     * @param {Number} status 返回状态 1成功 2失败
     * @param {String} message 返回消息
     * @param {Error} error 返回错误信息
     */
    res.ajaxReturn = (status, message, error, data) => {
            res.status(200)
            res.type('application/json')
            res.end(JSON.stringify({
                status: status,
                message: message,
                error: error,
                data: data
            }))
        }
        // 向下级传递
    next()
}