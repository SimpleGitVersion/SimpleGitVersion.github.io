module CSemVerPlayground.ReleaseTagVersion.Demo {
    var v = ReleaseTagVersion.fromVersionParts(null, 1, 0, 0, "alpha", 0, 0, 0, ReleaseTagKind.PreRelease);
    console.log(v);

    var successors = v.getDirectSuccessors();

    var bigv = +v.orderedVersion.toFixed();

    console.log(bigv); // expected: 130001000000001
    Debug.assert(bigv == 130001000000001);

    var v2 = ReleaseTagVersion.fromDecimal(new Big("130001000000001"));
    console.log(v2);

    var vparse = ReleaseTagVersion.tryParse("v0.0.0-alpha.0.99+published", true);
    console.log(vparse);
}