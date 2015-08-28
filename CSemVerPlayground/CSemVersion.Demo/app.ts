module CSemVerPlayground.CSemVersion.Demo {
    var v2 = CSemVersion.fromDecimal(new Big("130001000000001"));
    console.log(v2);

    var vparse = CSemVersion.tryParse("v0.0.0-alpha.0.99+published-1.0", true);
    console.log(vparse);
    console.log(vparse.toString());

    var vordered = CSemVersion.tryParse("v99999.99999.9999", true);
    console.log(vordered);
}