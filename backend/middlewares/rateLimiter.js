const limitter = require("express-rate-limit");

const registerLimitter = limitter({
    windowsMs: 1 * 60 * 1000,
    max: 3,
    message: "Trop de tentatives, veuillez reessayer plus tard"
})
const loginLimitter = limitter({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: "Trop de tentatives, veuillez reessayer plus tard"
})
module.exports = {
    register: registerLimitter,
    login: loginLimitter
}
