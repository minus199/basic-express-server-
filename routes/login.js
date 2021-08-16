const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/register", (req, res, next) => {
    new User({ email, password })
        .save()
        .then(user => res.json(user))
        .catch(err => res.json({ message: err })); 
});

router.get("/login", (req, res, next) => {
    req.session.accessCounter = (req.session.accessCounter || 0) + 1

    passport.authenticate("local", function (err, user, info) {
        if (err) {
            return res.status(400).json({ errors: err });
        }

        if (!user) {
            return res.status(400).json({ errors: "No user found" });
        }

        req.logIn(user, function (err) {
            if (err) {
                return res.status(400).json({ errors: err });
            }
            return res.status(200).json({ success: `logged in ${user.id}` });
        });
    })(req, res, next);
});

module.exports = router;