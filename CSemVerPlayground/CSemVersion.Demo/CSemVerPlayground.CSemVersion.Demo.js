var CSemVerPlayground;
(function (CSemVerPlayground) {
    var CSemVersion;
    (function (CSemVersion) {
        var Demo;
        (function (Demo) {
            var v = CSemVersion.CSemVersion.fromVersionParts(null, 1, 0, 0, "alpha", 0, 0, 0, null, CSemVersion.ReleaseTagKind.PreRelease);
            console.log(v);
            var successors = v.getDirectSuccessors();
            var bigv = +v.orderedVersion.toFixed();
            console.log(bigv); // expected: 130001000000001
            CSemVersion.Debug.assert(bigv == 130001000000001);
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
//# sourceMappingURL=CSemVerPlayground.CSemVersion.Demo.js.map