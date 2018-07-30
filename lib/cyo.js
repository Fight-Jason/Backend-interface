const crypto = require('crypto')

/**
 * 
 * @param {String} str 封装加密模块（加密密码）
 */
function md5(str) {
    let md5Str = crypto.createHash('md5')
        .update(str)
        .digest('hex')
    return md5Str
}

/**
 * sha1
 * @param {String} str 封装加密模块（加密密码）
 */
function sha1(str) {
    let sha = crypto.createHash('sha1')
        .update(str)
        .digest('hex')
    return sha
}
/**
 * sha128
 * @param {String} str 封装加密模块（加密密码）
 */
function sha128(str) {
    let sha = crypto.createHash('str')
        .update(str)
        .digest('hex')
    return sha
}
/**
 * sha256
 * @param {String} str 封装加密模块（加密密码）
 */
function sha256(str) {
    let sha = crypto.createHash('sha256')
        .update(str)
        .digest('hex')
    return sha
}

// 暴露模块
module.exports = {
    md5,
    sha1,
    sha128,
    sha256
}