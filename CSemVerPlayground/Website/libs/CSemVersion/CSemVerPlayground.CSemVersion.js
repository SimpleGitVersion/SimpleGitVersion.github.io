var CSemVerPlayground;
(function (CSemVerPlayground) {
    var CSemVersion;
    (function (CSemVersion) {
        var Debug = (function () {
            function Debug() {
            }
            Debug.assert = function (condition, error) {
                if (!condition) {
                    throw new Error(error);
                }
            };
            return Debug;
        })();
        CSemVersion.Debug = Debug;
    })(CSemVersion = CSemVerPlayground.CSemVersion || (CSemVerPlayground.CSemVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var CSemVersion;
    (function (CSemVersion) {
        (function (Format) {
            // Normalized format is 'v' + <see cref="SemVerWithMarker"/>.
            // This is the default.
            Format[Format["Normalized"] = 0] = "Normalized";
            // Semantic version format.
            // The prerelease name is the standard one (ie. 'prerelease' for any unknown name) and there is no build meata data.
            Format[Format["SemVer"] = 1] = "SemVer";
            // Semantic version format.
            // The prerelease name is the standard one (ie. 'prerelease' for any unknown name) plus build meata data (+valid, +published or +invalid).
            Format[Format["SemVerWithMarker"] = 2] = "SemVerWithMarker";
            // The ordered version in dotted notation (1542.6548.777.8787) where each parts are between 0 and 65535.
            Format[Format["DottedOrderedVersion"] = 3] = "DottedOrderedVersion";
            // NuGet version 2. If the <see cref="CSemVersion.IsMarkedInvalid"/> the "+invalid" build meta data is added.
            Format[Format["NugetPackageV2"] = 4] = "NugetPackageV2";
            // NuGet format. Currently <see cref="NugetPackageV2"/>.
            Format[Format["NuGetPackage"] = 4] = "NuGetPackage";
            // Default is <see cref="SemVerWithMarker"/>.
            Format[Format["Default"] = 0] = "Default";
        })(CSemVersion.Format || (CSemVersion.Format = {}));
        var Format = CSemVersion.Format;
    })(CSemVersion = CSemVerPlayground.CSemVersion || (CSemVerPlayground.CSemVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var CSemVersion;
    (function (CSemVersion_1) {
        var CSemVersion = (function () {
            function CSemVersion() {
                this.marker = "";
            }
            // ========== Static constructors ==========
            CSemVersion.fromVersionParts = function (tag, major, minor, patch, preReleaseName, preReleaseNameIdx, preReleaseNumber, preReleaseFix, marker, kind) {
                var v = new CSemVersion();
                v.major = major;
                v.minor = minor;
                v.patch = patch;
                v.preReleaseNameFromTag = preReleaseName;
                v.preReleaseNameIdx = preReleaseNameIdx;
                v.preReleaseNumber = preReleaseNumber;
                v.preReleaseFix = preReleaseFix;
                v.kind = kind;
                v.marker = marker != null ? marker : "";
                v.originalTagText = tag != null ? tag : v.toString();
                v.sOrderedVersion = new CSemVersion_1.SOrderedVersion();
                v.sOrderedVersion.Number = this.computeOrderedVersion(major, minor, patch, preReleaseNameIdx, preReleaseNumber, preReleaseFix);
                return v;
            };
            CSemVersion.fromDecimal = function (d) {
                var v = new CSemVersion();
                if (d.eq(0)) {
                    v.kind = CSemVersion_1.ReleaseTagKind.None;
                    v.parseErrorMessage = this.noTagParseErrorMessage;
                    v.preReleaseNameIdx = -1;
                }
                else {
                    v.sOrderedVersion = new CSemVersion_1.SOrderedVersion();
                    v.sOrderedVersion.Number = d;
                    var preReleasePart = d.mod(this.mulPatch);
                    if (!preReleasePart.eq(0)) {
                        preReleasePart = preReleasePart.minus(1);
                        v.preReleaseNameIdx = parseInt(preReleasePart.div(this.mulName).toFixed());
                        v.preReleaseNameFromTag = this.standardNames[v.preReleaseNameIdx];
                        preReleasePart = preReleasePart.minus(this.mulName.times(v.preReleaseNameIdx));
                        v.preReleaseNumber = parseInt(preReleasePart.div(this.mulNum).toFixed());
                        preReleasePart = preReleasePart.minus(this.mulNum.times(v.preReleaseNumber));
                        v.preReleaseFix = parseInt(preReleasePart.toFixed());
                        v.kind = CSemVersion_1.ReleaseTagKind.PreRelease;
                    }
                    else {
                        d = d.minus(this.mulPatch);
                        v.preReleaseNameIdx = -1;
                        v.preReleaseNameFromTag = "";
                        v.kind = CSemVersion_1.ReleaseTagKind.Release;
                    }
                    v.major = parseInt(d.div(this.mulMajor).toFixed());
                    d = d.minus(this.mulMajor.times(v.major));
                    v.minor = parseInt(d.div(this.mulMinor).toFixed());
                    d = d.minus(this.mulMinor.times(v.minor));
                    v.patch = parseInt(d.div(this.mulPatch).toFixed());
                }
                return v;
            };
            CSemVersion.fromFailedParsing = function (tag, isMalformed, errorMessage) {
                var v = new CSemVersion();
                v.originalTagText = tag;
                v.kind = CSemVersion_1.ReleaseTagKind.None;
                if (isMalformed) {
                    v.kind = CSemVersion_1.ReleaseTagKind.Malformed;
                }
                v.parseErrorMessage = isMalformed ? "Tag '" + tag + "': " + errorMessage : errorMessage;
                v.preReleaseNameIdx = -1;
                v.preReleaseFix = 0;
                return v;
            };
            Object.defineProperty(CSemVersion.prototype, "preReleaseName", {
                get: function () {
                    return this.isPreRelease ? CSemVersion.standardNames[this.preReleaseNameIdx] : "";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion.prototype, "isPreRelease", {
                get: function () {
                    return this.preReleaseNameIdx >= 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion.prototype, "isPreReleaseNameStandard", {
                get: function () {
                    return this.isPreRelease && (this.preReleaseNameIdx != CSemVersion.maxPreReleaseNameIdx - 1 || this.preReleaseNameFromTag.toLowerCase() == CSemVersion.standardNames[CSemVersion.maxPreReleaseNameIdx - 1]);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion.prototype, "isPreReleaseFix", {
                get: function () {
                    return this.preReleaseFix > 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion.prototype, "isValid", {
                get: function () {
                    return this.preReleaseNameFromTag != null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion.prototype, "isMalformed", {
                get: function () {
                    return (this.kind & CSemVersion_1.ReleaseTagKind.Malformed) != 0;
                },
                enumerable: true,
                configurable: true
            });
            CSemVersion.prototype.getDirectSuccessors = function (closest) {
                if (closest === void 0) { closest = false; }
                var successors = new Array();
                if (this.isValid) {
                    if (this.isPreRelease) {
                        var nextFix = this.preReleaseFix + 1;
                        if (nextFix <= CSemVersion.maxPreReleaseFix) {
                            successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, this.patch, this.preReleaseName, this.preReleaseNameIdx, this.preReleaseNumber, nextFix, null, CSemVersion_1.ReleaseTagKind.PreRelease));
                        }
                        var nextPrereleaseNumber = this.preReleaseNumber + 1;
                        if (nextPrereleaseNumber <= CSemVersion.maxPreReleaseNumber) {
                            successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, this.patch, this.preReleaseName, this.preReleaseNameIdx, nextPrereleaseNumber, 0, null, CSemVersion_1.ReleaseTagKind.PreRelease));
                        }
                        var nextPrereleaseNameIdx = this.preReleaseNameIdx + 1;
                        if (nextPrereleaseNameIdx <= CSemVersion.maxPreReleaseNameIdx) {
                            successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, this.patch, CSemVersion.standardNames[nextPrereleaseNameIdx], nextPrereleaseNameIdx, 0, 0, null, CSemVersion_1.ReleaseTagKind.PreRelease));
                            if (!closest) {
                                while (++nextPrereleaseNameIdx <= CSemVersion.maxPreReleaseNameIdx) {
                                    successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, this.patch, CSemVersion.standardNames[nextPrereleaseNameIdx], nextPrereleaseNameIdx, 0, 0, null, CSemVersion_1.ReleaseTagKind.PreRelease));
                                }
                            }
                        }
                        successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, this.patch, "", -1, 0, 0, null, CSemVersion_1.ReleaseTagKind.Release));
                    }
                    else {
                        var nextPatch = this.patch + 1;
                        if (nextPatch <= CSemVersion.maxPatch) {
                            successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, nextPatch, "alpha", 0, 0, 0, null, CSemVersion_1.ReleaseTagKind.PreRelease));
                            if (!closest) {
                                for (var i = 1; i <= CSemVersion.maxPreReleaseNameIdx; ++i) {
                                    successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, nextPatch, CSemVersion.standardNames[i], i, 0, 0, null, CSemVersion_1.ReleaseTagKind.PreRelease));
                                }
                            }
                            successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, nextPatch, "", -1, 0, 0, null, CSemVersion_1.ReleaseTagKind.Release));
                        }
                    }
                    var nextMinor = this.minor + 1;
                    if (nextMinor <= CSemVersion.maxMinor) {
                        successors.push(CSemVersion.fromVersionParts(null, this.major, nextMinor, 0, "alpha", 0, 0, 0, null, CSemVersion_1.ReleaseTagKind.PreRelease));
                        if (!closest) {
                            for (var i = 1; i <= CSemVersion.maxPreReleaseNameIdx; ++i) {
                                successors.push(CSemVersion.fromVersionParts(null, this.major, nextMinor, 0, CSemVersion.standardNames[i], i, 0, 0, null, CSemVersion_1.ReleaseTagKind.PreRelease));
                            }
                        }
                        successors.push(CSemVersion.fromVersionParts(null, this.major, nextMinor, 0, "", -1, 0, 0, null, CSemVersion_1.ReleaseTagKind.Release));
                    }
                    var nextMajor = this.major + 1;
                    if (nextMajor <= CSemVersion.maxMajor) {
                        successors.push(CSemVersion.fromVersionParts(null, nextMajor, 0, 0, "alpha", 0, 0, 0, null, CSemVersion_1.ReleaseTagKind.PreRelease));
                        if (!closest) {
                            for (var i = 1; i <= CSemVersion.maxPreReleaseNameIdx; ++i) {
                                successors.push(CSemVersion.fromVersionParts(null, nextMajor, 0, 0, CSemVersion.standardNames[i], i, 0, 0, null, CSemVersion_1.ReleaseTagKind.PreRelease));
                            }
                        }
                        successors.push(CSemVersion.fromVersionParts(null, nextMajor, 0, 0, "", -1, 0, 0, null, CSemVersion_1.ReleaseTagKind.Release));
                    }
                }
                return successors;
            };
            CSemVersion.prototype.isDirectPredecessor = function (previous) {
                if (!this.isValid)
                    return false;
                var num = this.sOrderedVersion.Number;
                if (previous == null)
                    return CSemVersion.firstPossibleVersions.indexOf(this) > -1;
                if (previous.sOrderedVersion.Number.gte(num))
                    return false;
                if (previous.sOrderedVersion.Number.eq(num.minus(1)))
                    return true;
                if (this.major > previous.major + 1)
                    return false;
                if (this.major != previous.major) {
                    return this.minor == 0 && this.patch == 0 && this.preReleaseNumber == 0 && this.preReleaseFix == 0;
                }
                if (this.minor > previous.minor + 1)
                    return false;
                if (this.minor != previous.minor) {
                    return this.patch == 0 && this.preReleaseNumber == 0 && this.preReleaseFix == 0;
                }
                if (this.patch > previous.patch + 1)
                    return false;
                if (this.patch != previous.patch) {
                    if (previous.isPreRelease)
                        return false;
                    return this.preReleaseNumber == 0 && this.preReleaseFix == 0;
                }
                if (!this.isPreRelease)
                    return true;
                if (this.preReleaseFix > 0)
                    return false;
                if (this.preReleaseNumber > 0) {
                    if (previous.preReleaseNameIdx == this.preReleaseNameIdx) {
                        return true;
                    }
                    return false;
                }
                return true;
            };
            Object.defineProperty(CSemVersion, "maxMajor", {
                get: function () { return 99999; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "maxMinor", {
                get: function () { return 99999; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "maxPatch", {
                get: function () { return 9999; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "maxPreReleaseNameIdx", {
                get: function () { return 12; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "maxPreReleaseNumber", {
                get: function () { return 99; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "maxPreReleaseFix", {
                get: function () { return 99; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "standardNames", {
                get: function () {
                    return ["alpha", "beta", "delta", "epsilon", "gamma", "iota", "kappa", "lambda", "mu", "omicron", "pi", "prerelease", "rc"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "mulNum", {
                get: function () {
                    return new Big(this.maxPreReleaseFix + 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "mulName", {
                get: function () {
                    return this.mulNum.times(this.maxPreReleaseNumber + 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "mulPatch", {
                get: function () {
                    return (this.mulName.times(this.maxPreReleaseNameIdx + 1)).plus(1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "mulMinor", {
                get: function () {
                    return this.mulPatch.times(this.maxPatch + 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "mulMajor", {
                get: function () {
                    return this.mulMinor.times(this.maxMinor + 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "divPatch", {
                get: function () {
                    return this.mulPatch.plus(1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "divMinor", {
                get: function () {
                    return this.divPatch.times(this.maxPatch);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "divMajor", {
                get: function () {
                    return this.divMinor.times(this.maxMinor + 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "standardPreReleaseNames", {
                get: function () {
                    return this.standardNames;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "veryFirstVersion", {
                get: function () {
                    return CSemVersion.fromDecimal(new Big(1));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "firstPossibleVersions", {
                get: function () {
                    return CSemVersion.buildFirstPossibleVersions();
                },
                enumerable: true,
                configurable: true
            });
            CSemVersion.buildFirstPossibleVersions = function () {
                var versions = new Array();
                var v = new Big(1);
                var i = 0;
                while (i < 3 * 14) {
                    versions[i++] = CSemVersion.fromDecimal(v);
                    if ((i % 28) == 0)
                        v = v.plus(this.mulMajor).minus(this.mulMinor).minus(this.mulPatch).plus(1);
                    else if ((i % 14) == 0)
                        v = v.plus(this.mulMinor).minus(this.mulPatch).plus(1);
                    else
                        v = v.plus(this.mulName);
                }
                return versions;
            };
            CSemVersion.computeOrderedVersion = function (major, minor, patch, preReleaseNameIdx, preReleaseNumber, preReleaseFix) {
                if (preReleaseNameIdx === void 0) { preReleaseNameIdx = -1; }
                if (preReleaseNumber === void 0) { preReleaseNumber = 0; }
                if (preReleaseFix === void 0) { preReleaseFix = 0; }
                var v = this.mulMajor.times(major);
                v = v.plus(this.mulMinor.times(minor));
                v = v.plus(this.mulPatch.times(patch + 1));
                if (preReleaseNameIdx >= 0) {
                    v = v.minus(this.mulPatch.minus(1));
                    v = v.plus(this.mulName.times(preReleaseNameIdx));
                    v = v.plus(this.mulNum.times(preReleaseNumber));
                    v = v.plus(preReleaseFix);
                }
                CSemVersion_1.Debug.assert(CSemVersion.fromDecimal(v).orderedVersion == v);
                CSemVersion_1.Debug.assert(preReleaseNameIdx >= 0 == (!v.mod(this.mulPatch).eq(0)));
                return v;
            };
            Object.defineProperty(CSemVersion.prototype, "orderedVersion", {
                get: function () {
                    return this.sOrderedVersion.Number;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion.prototype, "orderedVersionMajor", {
                get: function () {
                    return this.sOrderedVersion.Major;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion.prototype, "orderedVersionMinor", {
                get: function () {
                    return this.sOrderedVersion.Minor;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion.prototype, "orderedVersionBuild", {
                get: function () {
                    return this.sOrderedVersion.Build;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion.prototype, "orderedVersionRevision", {
                get: function () {
                    return this.sOrderedVersion.Revision;
                },
                enumerable: true,
                configurable: true
            });
            CSemVersion.prototype.equals = function (other) {
                if (other == null)
                    return false;
                return this.sOrderedVersion.Number == other.sOrderedVersion.Number;
            };
            CSemVersion.prototype.compareTo = function (other) {
                if (other == null)
                    return 1;
                return this.sOrderedVersion.Number.cmp(other.sOrderedVersion.Number);
            };
            Object.defineProperty(CSemVersion, "noTagParseErrorMessage", {
                // ========== ReleaseTagVersion.Parse.cs ==========
                get: function () { return "Not a valid tag."; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "regexStrict", {
                get: function () {
                    return /^v?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-([a-z]+)(?:\.(0|[1-9][0-9]?)(?:\.([1-9][0-9]?))?)?)?(?:\+([0-9a-z-]+(?:\.[0-9a-z-]+)*))?$/i;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CSemVersion, "regexApprox", {
                get: function () {
                    return /^(?:v|V)?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:\.(0|[1-9][0-9]*))?([^\n]*)?$/;
                },
                enumerable: true,
                configurable: true
            });
            CSemVersion.tryParse = function (s, analyseInvalidTag) {
                if (analyseInvalidTag === void 0) { analyseInvalidTag = false; }
                if (s == null)
                    throw new Error("ArgumentNullException");
                var m = this.regexStrict.exec(s);
                if (m == null || !m.length) {
                    if (analyseInvalidTag) {
                        m = this.regexApprox.exec(s);
                        if (m != null && m.length)
                            return CSemVersion.fromFailedParsing(s, true, this.syntaxErrorHelper(s, m));
                    }
                    return CSemVersion.fromFailedParsing(s, false, this.noTagParseErrorMessage);
                }
                var sMajor = m[1];
                var sMinor = m[2];
                var sPatch = m[3];
                var major = parseInt(sMajor);
                var minor = parseInt(sMinor);
                var patch = parseInt(sPatch);
                if (major == NaN || major > this.maxMajor)
                    return CSemVersion.fromFailedParsing(s, true, "Incorrect Major version. Must not be greater than " + this.maxMajor + ".");
                if (minor == NaN || minor > this.maxMinor)
                    return CSemVersion.fromFailedParsing(s, true, "Incorrect Minor version. Must not be greater than " + this.maxMinor + ".");
                if (patch == NaN || patch > this.maxPatch)
                    return CSemVersion.fromFailedParsing(s, true, "Incorrect Patch version. Must not be greater than " + this.maxPatch + ".");
                var sPRName = m[4];
                var sPRNum = m[5];
                var sPRFix = m[6];
                var sBuildMetaData = m[7];
                var prNameIdx = this.getPreReleaseNameIdx(sPRName);
                var prNum = 0;
                var prFix = 0;
                if (prNameIdx >= 0) {
                    if (sPRFix != null && sPRFix.length > 0)
                        prFix = parseInt(sPRFix);
                    if (sPRNum != null && sPRNum.length > 0)
                        prNum = parseInt(sPRNum);
                    if (prFix == 0 && prNum == 0 && (sPRNum != null && sPRNum.length > 0))
                        return CSemVersion.fromFailedParsing(s, true, "Incorrect '.0' Release Number version. 0 can appear only to fix the first pre release (ie. '.0.F' where F is between 1 and " + this.maxPreReleaseFix + ").");
                }
                var kind = prNameIdx >= 0 ? CSemVersion_1.ReleaseTagKind.PreRelease : CSemVersion_1.ReleaseTagKind.Release;
                var marker = sBuildMetaData;
                return CSemVersion.fromVersionParts(s, major, minor, patch, sPRName, prNameIdx, prNum, prFix, sBuildMetaData, kind);
            };
            Object.defineProperty(CSemVersion, "regexApproxSuffix", {
                get: function () {
                    return /^(?:-([^\n]*?))?(?:\+([^\n]*))?$/;
                },
                enumerable: true,
                configurable: true
            });
            CSemVersion.syntaxErrorHelper = function (s, mApproximate) {
                if (mApproximate[3] != null && mApproximate[3].length == 0)
                    return "There must be at least 3 numbers (Major.Minor.Patch).";
                var buildMetaData = mApproximate[4];
                if (buildMetaData != null && buildMetaData.length > 0) {
                    var mSuffix = this.regexApproxSuffix.exec(buildMetaData);
                    if (mSuffix == null || mSuffix.length == 0)
                        return "Major.Minor.Patch must be followed by a '-' and a pre release name (ie. 'v1.0.2-alpha') and/or a build metadata.";
                    var prerelease = mSuffix[1];
                    var fragment = mSuffix[2];
                    if (prerelease != null && prerelease.length > 0) {
                        var dotParts = prerelease.split(".");
                        if (!/^[a-z]+$/.test(dotParts[0])) {
                            return "Pre release name must be only alpha (a-z) and should be: " + this.standardNames.join(", ");
                        }
                        if (dotParts.length > 1) {
                            var prNum = parseInt(dotParts[1]);
                            if (prNum == NaN || prNum < 0 || prNum > this.maxPreReleaseNumber) {
                                return "Pre Release Number must be between 1 and " + this.maxPreReleaseNumber + ".";
                            }
                            if (dotParts.length > 2) {
                                var prFix = parseInt(dotParts[2]);
                                if (prFix == NaN || prFix < 1 || prFix > this.maxPreReleaseFix) {
                                    return "Fix Number must be between 1 and " + this.maxPreReleaseFix + ".";
                                }
                            }
                            else if (prNum == 0)
                                return "Incorrect '.0' release Number version. 0 can appear only to fix the first pre release (ie. '.0.XX' where XX is between 1 and " + this.maxPreReleaseFix + ").";
                        }
                        if (dotParts.length > 3)
                            return "Too much parts: there can be at most two trailing numbers like in '-alpha.1.2'.";
                    }
                    if (fragment != null && fragment.length > 0) {
                        return "Invalid build metadata. Valid examples are: '+001', '+20130313144700', or '1.0.0-beta+exp.sha.5114f85'.";
                    }
                }
                return "Invalid tag. Valid examples are: '1.0.0', '1.0.0-beta', '1.0.0-beta.5', '1.0.0-rc.5.12', '3.0.12+001' or 7.2.3-gamma+published";
            };
            CSemVersion.getPreReleaseNameIdx = function (preReleaseName) {
                if (preReleaseName == null || preReleaseName.length == 0)
                    return -1;
                var prNameIdx = this.standardNames.indexOf(preReleaseName);
                if (prNameIdx < 0)
                    prNameIdx = this.maxPreReleaseNameIdx - 1;
                return prNameIdx;
            };
            // ========== ReleaseTagVersion.ToString.cs ==========
            CSemVersion.prototype.toString = function (f, usePreReleaseNameFromTag) {
                if (f === void 0) { f = CSemVersion_1.Format.Normalized; }
                if (usePreReleaseNameFromTag === void 0) { usePreReleaseNameFromTag = false; }
                if (this.parseErrorMessage != null)
                    return this.parseErrorMessage;
                if (f == CSemVersion_1.Format.DottedOrderedVersion) {
                    return this.orderedVersionMajor + "." + this.orderedVersionMinor + "." + this.orderedVersionBuild + "." + this.orderedVersionRevision;
                }
                var prName = usePreReleaseNameFromTag ? this.preReleaseNameFromTag : this.preReleaseName;
                switch (f) {
                    case CSemVersion_1.Format.NugetPackageV2: {
                        var marker = this.marker != "" ? "+" + this.marker : "";
                        if (this.isPreRelease) {
                            if (this.isPreReleaseFix) {
                                return this.major + "." + this.minor + "." + this.patch + "-" + prName + "-" + this.preReleaseNumber + "-" + this.preReleaseFix + marker;
                            }
                            if (this.preReleaseNumber > 0) {
                                return this.major + "." + this.minor + "." + this.patch + "-" + prName + "-" + this.preReleaseNumber + marker;
                            }
                            return this.major + "." + this.minor + "." + this.patch + "-" + prName + marker;
                        }
                        return this.major + "." + this.minor + "." + this.patch + marker;
                    }
                    case CSemVersion_1.Format.SemVer:
                    case CSemVersion_1.Format.SemVerWithMarker: {
                        var marker = f == CSemVersion_1.Format.SemVerWithMarker && this.marker != "" ? "+" + this.marker : "";
                        if (this.isPreRelease) {
                            if (this.isPreReleaseFix) {
                                return this.major + "." + this.minor + "." + this.patch + "-" + prName + "." + this.preReleaseNumber + "." + this.preReleaseFix + marker;
                            }
                            if (this.preReleaseNumber > 0) {
                                return this.major + "." + this.minor + "." + this.patch + "-" + prName + "." + this.preReleaseNumber + marker;
                            }
                            return this.major + "." + this.minor + "." + this.patch + "-" + prName + marker;
                        }
                        return this.major + "." + this.minor + "." + this.patch + marker;
                    }
                    default: {
                        CSemVersion_1.Debug.assert(f == CSemVersion_1.Format.Normalized);
                        var marker = this.marker != "" ? "+" + this.marker : "";
                        if (this.isPreRelease) {
                            if (this.isPreReleaseFix) {
                                return "v" + this.major + "." + this.minor + "." + this.patch + "-" + prName + "." + this.preReleaseNumber + "." + this.preReleaseFix + marker;
                            }
                            if (this.preReleaseNumber > 0) {
                                return "v" + this.major + "." + this.minor + "." + this.patch + "-" + prName + "." + this.preReleaseNumber + marker;
                            }
                            return "v" + this.major + "." + this.minor + "." + this.patch + "-" + prName + marker;
                        }
                        return "v" + this.major + "." + this.minor + "." + this.patch + marker;
                    }
                }
            };
            return CSemVersion;
        })();
        CSemVersion_1.CSemVersion = CSemVersion;
    })(CSemVersion = CSemVerPlayground.CSemVersion || (CSemVerPlayground.CSemVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var CSemVersion;
    (function (CSemVersion) {
        (function (ReleaseTagKind) {
            // Not a release tag.
            ReleaseTagKind[ReleaseTagKind["None"] = 0] = "None";
            // The tag looks like a release tag but is syntaxically incorrect.
            ReleaseTagKind[ReleaseTagKind["Malformed"] = 1] = "Malformed";
            // This release tag is 'Major.Minor.Patch' only.
            ReleaseTagKind[ReleaseTagKind["Release"] = 2] = "Release";
            // This release tag is 'Major.Minor.Patch-prerelease[.Number[.Fix]]'.
            ReleaseTagKind[ReleaseTagKind["PreRelease"] = 4] = "PreRelease";
        })(CSemVersion.ReleaseTagKind || (CSemVersion.ReleaseTagKind = {}));
        var ReleaseTagKind = CSemVersion.ReleaseTagKind;
    })(CSemVersion = CSemVerPlayground.CSemVersion || (CSemVerPlayground.CSemVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var CSemVersion;
    (function (CSemVersion) {
        var SOrderedVersion = (function () {
            function SOrderedVersion() {
            }
            return SOrderedVersion;
        })();
        CSemVersion.SOrderedVersion = SOrderedVersion;
    })(CSemVersion = CSemVerPlayground.CSemVersion || (CSemVerPlayground.CSemVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
