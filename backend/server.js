const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");


module.exports = function(host = "127.0.0.1", port = "9200") {
    const app = express();

    require("./router")(app);
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "*");
        next();
    });

    app.use(express.static(path.join(__dirname, "../frontend")));

    app.listen(port, host, function() {
        console.log("Server is running on port " + port + "...");
    });

};