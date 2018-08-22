module.exports = {
    integerDiv: function(amount, divider) {
        return Math.floor(amount / divider);
    },
    isNatural: function(amount) {
        return amount.toString().match(/^\d+$/) === null;
    },
    getTotalFromObject: function(obj) {
        return Object.keys(obj).reduce((sum, key) => {
            return sum + parseInt(key, 10) * obj[key];
        }, 0);
    }
};