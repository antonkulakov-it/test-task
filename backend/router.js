const Coins = require("../components/coins");
const coins = new Coins();

module.exports = function(app) {
    app.get("/change", function(req, res) {
        let result;
        let amount = req.query.amount;
        let limited = req.query.limited;

        if (amount >= Number.MAX_SAFE_INTEGER) {
            return res.status(500).send({ message: "Your coins number is too large. Max value is " + Number.MAX_SAFE_INTEGER });
        }
        try {
            if (limited) {
                result = coins.getChangeFor(amount, limited);
            } else {
                result = coins.getOptimalChangeFor(amount);
            }
        } catch (e) {
            res.status(500).send({ message: e.message });
        }
        res.send(result);
    });
};