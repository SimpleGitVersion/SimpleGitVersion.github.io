var CSemVerPlayground;
(function (CSemVerPlayground) {
    var CSemVersion;
    (function (CSemVersion) {
        var Demo;
        (function (Demo) {
            var v2 = CSemVersion.CSemVersion.fromDecimal(new Big("130001000000001"));
            console.log(v2);
            var vparse = CSemVersion.CSemVersion.tryParse("v0.0.0-alpha.0.99+published-1.0", true);
            console.log(vparse);
            console.log(vparse.toString());
            var vordered = CSemVersion.CSemVersion.tryParse("v99999.99999.9999", true);
            console.log(vordered);
        })(Demo = CSemVersion.Demo || (CSemVersion.Demo = {}));
    })(CSemVersion = CSemVerPlayground.CSemVersion || (CSemVerPlayground.CSemVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
//# sourceMappingURL=CSemVersion.Demo.js.map