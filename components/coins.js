const algebra = require("../helpers/algebra");

class Coins {
    constructor(startData) {
        this.money = startData || {
            100: 11,
            50: 24,
            20: 0,
            10: 99,
            5: 200,
            2: 11,
            1: 23
        };

        this._keys = Object.keys(this.money).sort((a, b) => {
            if (a === b) return 0;
            return parseInt(a, 10) < parseInt(b, 10) ? 1 : -1;
        });

        this.total = algebra.getTotalFromObject(this.money);
    }

    *_getIterator() {
        yield* this._keys;
    }

    getOptimalChangeFor(euro, limited = false) {
        let remain = euro;
        let result = {};

        if (algebra.isNatural(euro)) {
            throw new Error("Please input correct amount.");
        }

        for (let nominal of this._getIterator()) {
            let countOfCoins = this._getCountOfCoins(remain, nominal, limited);
            let amountOfCoins = countOfCoins * nominal;

            remain -= amountOfCoins;
            if (amountOfCoins > 0) {
                result[nominal] = countOfCoins;
            }
            if (remain === 0) {
                break;
            }
            if (remain < 0) {
                throw new Error("Sorry, we don't have enough money to change your amount.");
            }
        }

        if (Object.keys(result).length === 0) {
            throw new Error("Sorry, we don't have enough money to change your amount.");
        }
        return result;
    }

    getChangeFor(euro) {
        let result = {};

        if (euro > this.total) {
            throw new Error("Sorry, we don't have enough money to change your amount.");
        }

        result = this.getOptimalChangeFor(euro, true);

        this._updateMoney(result);

        return result;
    }

    _updateMoney(data) {
        Object.keys(data).forEach(key => {
            this.money[key] -= data[key];
        });
        this.total = algebra.getTotalFromObject(this.money);
    }

    _getCountOfCoins(remain, nominal, limited) {
        return limited ? Math.min(algebra.integerDiv(remain, nominal), this.money[nominal]) : algebra.integerDiv(remain, nominal);
    }
}

module.exports = Coins;