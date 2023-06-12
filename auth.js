const argon2 = require("argon2");

const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
};

const hassPassword = (req, res, next) => {
    argon2
        .hash(req.body.password, hashingOptions)
        .then((hashedPassword) => {
            // do something with hashedPassword
            req.body.hashedPassword = hashedPassword;
            delete req.body.password;

            next();
        })
        .catch((err) => {
            // do something with err
            console.error(err);
            res.sendStatus(500);
        });
};

module.exports = {
    hassPassword,
};