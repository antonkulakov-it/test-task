process.env.NODE_ENV = "test";

const assert = require("assert");
const request = require("request");
const Coins = require("../components/coins");
const ETALON = {
    total: 4335,
    totalChanged: { 5: 1, 10: 1, 20: 1, 100: 43 },
    totalChangedLimited: { 100: 11, 50: 24, 20: 0, 10: 99, 5: 200, 2: 11, 1: 23 }
}

describe("Check of coins changing", function() {
    it ("Total value", function(done) {
        let coins = new Coins();

        assert.equal(coins.total, ETALON.total);
        done();
    });

    it ("Total value change", function(done) {
        let coins = new Coins();

        assert.deepEqual(coins.getOptimalChangeFor(ETALON.total), ETALON.totalChanged);
        done();
    });

    it ("Should throw exception in getChangeFor", function(done) {
        let coins = new Coins();
        assert.throws(
            () => {
                coins.getChangeFor(77777);
            },
            (e) => {
                if (e.message === "Sorry, we don't have enough money to change your amount.") return true;
            }
        );
        assert.throws(
            () => {
                coins.getChangeFor(-1);
            },
            (e) => {
                if (e.message === "Please input correct amount.") return true;
            }
        );
        assert.throws(
            () => {
                coins.getChangeFor("123aa");
            },
            (e) => {
                if (e.message === "Please input correct amount.") return true;
            }
        );
        assert.throws(
            () => {
                coins.getChangeFor("aa11");
            },
            (e) => {
                if (e.message === "Please input correct amount.") return true;
            }
        );
        assert.throws(
            () => {
                coins.getChangeFor("11.11");
            },
            (e) => {
                if (e.message === "Please input correct amount.") return true;
            }
        );
        assert.throws(
            () => {
                coins.getChangeFor(.11);
            },
            (e) => {
                if (e.message === "Please input correct amount.") return true;
            }
        );
        done();
    });

    it ("Should decrease coins after getChangeFor", function(done) {
        let coins = new Coins();

        coins.getChangeFor(35);
        assert.equal(coins.total, ETALON.total - 35);

        coins.getChangeFor(ETALON.total - 35);
        assert.equal(coins.total, 0);
        done();
    });

    it ("Test nominal case", function(done) {
        let coins = new Coins();

        for (let nominal of coins._getIterator()) {
            assert.equal(coins.getOptimalChangeFor(nominal)[nominal], 1);
        }
        done();
    });

    it ("Crash test of getChangeFor", function(done) {
        let coins = new Coins();

        for (let i = 0; i < 99; i++) {
            coins.getChangeFor(10);
        }

        for (let i = 0; i < 200; i++) {
            coins.getChangeFor(5);
        }

        for (let i = 0; i < 11; i++) {
            coins.getChangeFor(2);
        }

        for (let i = 0; i < 23; i++) {
            coins.getChangeFor(1);
        }

        assert.throws(
            () => {
                coins.getChangeFor(20);
            },
            (e) => {
                if (e.message === "Sorry, we don't have enough money to change your amount.") return true;
            }
        );
        done();
    });

    it ("Should throw exception in getOptimalChangeFor", function(done) {
        let coins = new Coins();

        assert.throws(
            () => {
                coins.getOptimalChangeFor(-1);
            },
            (e) => {
                if (e.message === "Please input correct amount.") return true;
            }
        );
        assert.throws(
            () => {
                coins.getOptimalChangeFor("123aa");
            },
            (e) => {
                if (e.message === "Please input correct amount.") return true;
            }
        );
        assert.throws(
            () => {
                coins.getOptimalChangeFor("aa11");
            },
            (e) => {
                if (e.message === "Please input correct amount.") return true;
            }
        );
        assert.throws(
            () => {
                coins.getOptimalChangeFor("11.11");
            },
            (e) => {
                if (e.message === "Please input correct amount.") return true;
            }
        );
        assert.throws(
            () => {
                coins.getOptimalChangeFor(.11);
            },
            (e) => {
                if (e.message === "Please input correct amount.") return true;
            }
        );
        done();
    });
});

describe("Backend api testing", function() {
    it ("should respond with status 200", function (done) {
        request("http://localhost:9200/", function (err, resp) {
            assert.equal(resp.statusCode, 200);
            done();
        });
    });

    it ("should respond with status 200", function (done) {
        request("http://localhost:9200/change?amount=20", function (err, resp) {
            assert.equal(resp.statusCode, 200);
            done();
        });
    });

    it ("should respond with status 200", function (done) {
        request("http://localhost:9200/change?amount=20&limit=true", function (err, resp) {
            assert.equal(resp.statusCode, 200);
            done();
        });
    });

    it ("should respond with status 500", function (done) {
        request("http://localhost:9200/change?amount=" + Number.MAX_SAFE_INTEGER, function (err, resp) {
            assert.equal(resp.statusCode, 500);
            done();
        });
    });
});