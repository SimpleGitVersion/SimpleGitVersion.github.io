var CSemVerPlayground;
(function (CSemVerPlayground) {
    var ReleaseTagVersion;
    (function (ReleaseTagVersion) {
        var Demo;
        (function (Demo) {
            var v = ReleaseTagVersion.ReleaseTagVersion.fromVersionParts(null, 1, 0, 0, "alpha", 0, 0, 0, ReleaseTagVersion.ReleaseTagKind.PreRelease);
            console.log(v);
            var successors = v.getDirectSuccessors();
            var bigv = +v.orderedVersion.toFixed();
            console.log(bigv); // expected: 130001000000001
            ReleaseTagVersion.Debug.assert(bigv == 130001000000001);
            var v2 = ReleaseTagVersion.ReleaseTagVersion.fromDecimal(new Big("130001000000001"));
            console.log(v2);
            var vparse = ReleaseTagVersion.ReleaseTagVersion.tryParse("v0.0.0-alpha.0.99+published", true);
            console.log(vparse);
        })(Demo = ReleaseTagVersion.Demo || (ReleaseTagVersion.Demo = {}));
    })(ReleaseTagVersion = CSemVerPlayground.ReleaseTagVersion || (CSemVerPlayground.ReleaseTagVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
//# sourceMappingURL=CSemVerPlayground.ReleaseTagVersion.Demo.js.map