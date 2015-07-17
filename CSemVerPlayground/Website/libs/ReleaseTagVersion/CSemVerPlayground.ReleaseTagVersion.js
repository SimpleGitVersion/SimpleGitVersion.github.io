var CSemVerPlayground;
(function (CSemVerPlayground) {
    var ReleaseTagVersion;
    (function (ReleaseTagVersion) {
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
        ReleaseTagVersion.Debug = Debug;
    })(ReleaseTagVersion = CSemVerPlayground.ReleaseTagVersion || (CSemVerPlayground.ReleaseTagVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var ReleaseTagVersion;
    (function (ReleaseTagVersion) {
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
            // NuGet version 2. If the <see cref="ReleaseTagVersion.IsMarkedInvalid"/> the "+invalid" build meta data is added.
            Format[Format["NugetPackageV2"] = 4] = "NugetPackageV2";
            // NuGet format. Currently <see cref="NugetPackageV2"/>.
            Format[Format["NuGetPackage"] = 4] = "NuGetPackage";
            // Default is <see cref="SemVerWithMarker"/>.
            Format[Format["Default"] = 0] = "Default";
        })(ReleaseTagVersion.Format || (ReleaseTagVersion.Format = {}));
        var Format = ReleaseTagVersion.Format;
    })(ReleaseTagVersion = CSemVerPlayground.ReleaseTagVersion || (CSemVerPlayground.ReleaseTagVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var ReleaseTagVersion;
    (function (ReleaseTagVersion) {
        (function (ReleaseTagKind) {
            // Not a release tag.
            ReleaseTagKind[ReleaseTagKind["None"] = 0] = "None";
            // The tag looks like a release tag but is syntaxically incorrect.
            ReleaseTagKind[ReleaseTagKind["Malformed"] = 1] = "Malformed";
            // This release tag is 'Major.Minor.Patch' only.
            ReleaseTagKind[ReleaseTagKind["Release"] = 2] = "Release";
            // This release tag is 'Major.Minor.Patch-prerelease[.Number[.Fix]]'.
            ReleaseTagKind[ReleaseTagKind["PreRelease"] = 4] = "PreRelease";
            // This release tag is +Valid.
            ReleaseTagKind[ReleaseTagKind["MarkedValid"] = 8] = "MarkedValid";
            // This release tag is +Published.
            ReleaseTagKind[ReleaseTagKind["MarkedPublished"] = 16] = "MarkedPublished";
            // This release tag is +Invalid.
            ReleaseTagKind[ReleaseTagKind["MarkedInvalid"] = 32] = "MarkedInvalid";
        })(ReleaseTagVersion.ReleaseTagKind || (ReleaseTagVersion.ReleaseTagKind = {}));
        var ReleaseTagKind = ReleaseTagVersion.ReleaseTagKind;
        var ReleaseTagKindExtensions = (function () {
            function ReleaseTagKindExtensions() {
            }
            ReleaseTagKindExtensions.isMarked = function (kind) {
                return (kind & (ReleaseTagKind.MarkedValid | ReleaseTagKind.MarkedPublished | ReleaseTagKind.MarkedInvalid)) != 0;
            };
            ReleaseTagKindExtensions.isMarkedValid = function (kind) {
                return (kind & ReleaseTagKind.MarkedValid) != 0;
            };
            ReleaseTagKindExtensions.isMarkedPublished = function (kind) {
                return (kind & ReleaseTagKind.MarkedPublished) != 0;
            };
            ReleaseTagKindExtensions.isMarkedInvalid = function (kind) {
                return (kind & ReleaseTagKind.MarkedInvalid) != 0;
            };
            ReleaseTagKindExtensions.clearMarker = function (kind) {
                return kind & ~(ReleaseTagKind.MarkedValid | ReleaseTagKind.MarkedPublished | ReleaseTagKind.MarkedInvalid);
            };
            ReleaseTagKindExtensions.toStringMarker = function (kind, prefixPlus) {
                if (prefixPlus === void 0) { prefixPlus = true; }
                switch (kind & (ReleaseTagKind.MarkedValid | ReleaseTagKind.MarkedPublished | ReleaseTagKind.MarkedInvalid)) {
                    case ReleaseTagKind.MarkedValid: return prefixPlus ? "+valid" : "valid";
                    case ReleaseTagKind.MarkedPublished: return prefixPlus ? "+published" : "published";
                    case ReleaseTagKind.MarkedInvalid: return prefixPlus ? "+invalid" : "invalid";
                }
                return "";
            };
            return ReleaseTagKindExtensions;
        })();
        ReleaseTagVersion.ReleaseTagKindExtensions = ReleaseTagKindExtensions;
    })(ReleaseTagVersion = CSemVerPlayground.ReleaseTagVersion || (CSemVerPlayground.ReleaseTagVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var ReleaseTagVersion;
    (function (ReleaseTagVersion_1) {
        var ReleaseTagVersion = (function () {
            function ReleaseTagVersion() {
                this.marker = "";
            }
            // ========== Static constructors ==========
            ReleaseTagVersion.fromVersionParts = function (tag, major, minor, patch, preReleaseName, preReleaseNameIdx, preReleaseNumber, preReleaseFix, kind) {
                var v = new ReleaseTagVersion();
                v.major = major;
                v.minor = minor;
                v.patch = patch;
                v.preReleaseNameFromTag = preReleaseName;
                v.preReleaseNameIdx = preReleaseNameIdx;
                v.preReleaseNumber = preReleaseNumber;
                v.preReleaseFix = preReleaseFix;
                v.kind = kind;
                v.marker = ReleaseTagVersion_1.ReleaseTagKindExtensions.toStringMarker(kind);
                v.originalTagText = tag != null ? tag : v.toString();
                v.sOrderedVersion = new ReleaseTagVersion_1.SOrderedVersion();
                v.sOrderedVersion.Number = this.computeOrderedVersion(major, minor, patch, preReleaseNameIdx, preReleaseNumber, preReleaseFix);
                v.definitionStrength = v.computeDefinitionStrength();
                return v;
            };
            ReleaseTagVersion.fromDecimal = function (d) {
                var v = new ReleaseTagVersion();
                if (d.eq(0)) {
                    v.kind = ReleaseTagVersion_1.ReleaseTagKind.None;
                    v.parseErrorMessage = this.noTagParseErrorMessage;
                    v.preReleaseNameIdx = -1;
                }
                else {
                    v.sOrderedVersion = new ReleaseTagVersion_1.SOrderedVersion();
                    v.sOrderedVersion.Number = d;
                    var preReleasePart = d.mod(this.mulPatch);
                    if (!preReleasePart.eq(0)) {
                        preReleasePart = preReleasePart.minus(1);
                        v.preReleaseNameIdx = +preReleasePart.div(this.mulName).toFixed(0);
                        v.preReleaseNameFromTag = this.standardNames[v.preReleaseNameIdx];
                        preReleasePart = preReleasePart.minus(this.mulName.times(v.preReleaseNameIdx));
                        v.preReleaseNumber = +preReleasePart.div(this.mulNum).toFixed(0);
                        preReleasePart = preReleasePart.minus(this.mulNum.times(v.preReleaseNumber));
                        v.preReleaseFix = +preReleasePart.toFixed(0);
                        v.kind = ReleaseTagVersion_1.ReleaseTagKind.PreRelease;
                    }
                    else {
                        d = d.minus(this.mulPatch);
                        v.preReleaseNameIdx = -1;
                        v.preReleaseNameFromTag = "";
                        v.kind = ReleaseTagVersion_1.ReleaseTagKind.Release;
                    }
                    v.major = +d.div(this.mulMajor).toFixed(0);
                    d = d.minus(this.mulMajor.times(v.major));
                    v.minor = +d.div(this.mulMinor).toFixed(0);
                    d = d.minus(this.mulMinor.times(v.minor));
                    v.patch = +d.div(this.mulPatch).toFixed(0);
                }
                return v;
            };
            ReleaseTagVersion.fromFailedParsing = function (tag, isMalformed, errorMessage) {
                var v = new ReleaseTagVersion();
                v.originalTagText = tag;
                v.kind = ReleaseTagVersion_1.ReleaseTagKind.None;
                if (isMalformed) {
                    v.kind = ReleaseTagVersion_1.ReleaseTagKind.Malformed;
                    v.definitionStrength = 1;
                }
                v.parseErrorMessage = isMalformed ? "Tag '" + tag + "': " + errorMessage : errorMessage;
                v.preReleaseNameIdx = -1;
                v.preReleaseFix = 0;
                return v;
            };
            Object.defineProperty(ReleaseTagVersion.prototype, "preReleaseName", {
                get: function () {
                    return this.isPreRelease ? ReleaseTagVersion.standardNames[this.preReleaseNameIdx] : "";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "isPreRelease", {
                get: function () {
                    return this.preReleaseNameIdx >= 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "isPreReleaseNameStandard", {
                get: function () {
                    return this.isPreRelease && (this.preReleaseNameIdx != ReleaseTagVersion.maxPreReleaseNameIdx - 1 || this.preReleaseNameFromTag.toLowerCase() == ReleaseTagVersion.standardNames[ReleaseTagVersion.maxPreReleaseNameIdx - 1]);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "isPreReleaseFix", {
                get: function () {
                    return this.preReleaseFix > 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "isValid", {
                get: function () {
                    return this.preReleaseNameFromTag != null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "isMarked", {
                get: function () {
                    return ReleaseTagVersion_1.ReleaseTagKindExtensions.isMarked(this.kind);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "isMarkedValid", {
                get: function () {
                    return ReleaseTagVersion_1.ReleaseTagKindExtensions.isMarkedValid(this.kind);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "isMarkedPublished", {
                get: function () {
                    return ReleaseTagVersion_1.ReleaseTagKindExtensions.isMarkedPublished(this.kind);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "isMarkedInvalid", {
                get: function () {
                    return ReleaseTagVersion_1.ReleaseTagKindExtensions.isMarkedInvalid(this.kind);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "isMalformed", {
                get: function () {
                    return (this.kind & ReleaseTagVersion_1.ReleaseTagKind.Malformed) != 0;
                },
                enumerable: true,
                configurable: true
            });
            ReleaseTagVersion.prototype.markValid = function () {
                if (!this.isValid)
                    throw new Error("InvalidOperationException: isn't valid");
                return this.isMarkedValid ? this : ReleaseTagVersion.fromVersionParts(null, this.major, this.minor, this.patch, this.preReleaseName, this.preReleaseNameIdx, this.preReleaseNumber, this.preReleaseFix, ReleaseTagVersion_1.ReleaseTagKindExtensions.clearMarker(this.kind) | ReleaseTagVersion_1.ReleaseTagKind.MarkedValid);
            };
            ReleaseTagVersion.prototype.markInvalid = function () {
                return this.isMarkedInvalid ? this : ReleaseTagVersion.fromVersionParts(null, this.major, this.minor, this.patch, this.preReleaseName, this.preReleaseNameIdx, this.preReleaseNumber, this.preReleaseFix, ReleaseTagVersion_1.ReleaseTagKindExtensions.clearMarker(this.kind) | ReleaseTagVersion_1.ReleaseTagKind.MarkedInvalid);
            };
            ReleaseTagVersion.prototype.getDirectSuccessors = function (closest) {
                if (closest === void 0) { closest = false; }
                var successors = new Array();
                if (this.isValid) {
                    if (this.isPreRelease) {
                        var nextFix = this.preReleaseFix + 1;
                        if (nextFix <= ReleaseTagVersion.maxPreReleaseFix) {
                            successors.push(ReleaseTagVersion.fromVersionParts(null, this.major, this.minor, this.patch, this.preReleaseName, this.preReleaseNameIdx, this.preReleaseNumber, nextFix, ReleaseTagVersion_1.ReleaseTagKind.PreRelease));
                        }
                        var nextPrereleaseNumber = this.preReleaseNumber + 1;
                        if (nextPrereleaseNumber <= ReleaseTagVersion.maxPreReleaseNumber) {
                            successors.push(ReleaseTagVersion.fromVersionParts(null, this.major, this.minor, this.patch, this.preReleaseName, this.preReleaseNameIdx, nextPrereleaseNumber, 0, ReleaseTagVersion_1.ReleaseTagKind.PreRelease));
                        }
                        var nextPrereleaseNameIdx = this.preReleaseNameIdx + 1;
                        if (nextPrereleaseNameIdx <= ReleaseTagVersion.maxPreReleaseNameIdx) {
                            successors.push(ReleaseTagVersion.fromVersionParts(null, this.major, this.minor, this.patch, ReleaseTagVersion.standardNames[nextPrereleaseNameIdx], nextPrereleaseNameIdx, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.PreRelease));
                            if (!closest) {
                                while (++nextPrereleaseNameIdx <= ReleaseTagVersion.maxPreReleaseNameIdx) {
                                    successors.push(ReleaseTagVersion.fromVersionParts(null, this.major, this.minor, this.patch, ReleaseTagVersion.standardNames[nextPrereleaseNameIdx], nextPrereleaseNameIdx, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.PreRelease));
                                }
                            }
                        }
                        successors.push(ReleaseTagVersion.fromVersionParts(null, this.major, this.minor, this.patch, "", -1, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.Release));
                    }
                    else {
                        var nextPatch = this.patch + 1;
                        if (nextPatch <= ReleaseTagVersion.maxPatch) {
                            successors.push(ReleaseTagVersion.fromVersionParts(null, this.major, this.minor, nextPatch, "alpha", 0, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.PreRelease));
                            if (!closest) {
                                for (var i = 1; i <= ReleaseTagVersion.maxPreReleaseNameIdx; ++i) {
                                    successors.push(ReleaseTagVersion.fromVersionParts(null, this.major, this.minor, nextPatch, ReleaseTagVersion.standardNames[i], i, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.PreRelease));
                                }
                            }
                            successors.push(ReleaseTagVersion.fromVersionParts(null, this.major, this.minor, nextPatch, "", -1, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.Release));
                        }
                    }
                    var nextMinor = this.minor + 1;
                    if (nextMinor <= ReleaseTagVersion.maxMinor) {
                        successors.push(ReleaseTagVersion.fromVersionParts(null, this.major, nextMinor, 0, "alpha", 0, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.PreRelease));
                        if (!closest) {
                            for (var i = 1; i <= ReleaseTagVersion.maxPreReleaseNameIdx; ++i) {
                                successors.push(ReleaseTagVersion.fromVersionParts(null, this.major, nextMinor, 0, ReleaseTagVersion.standardNames[i], i, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.PreRelease));
                            }
                        }
                        successors.push(ReleaseTagVersion.fromVersionParts(null, this.major, nextMinor, 0, "", -1, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.Release));
                    }
                    var nextMajor = this.major + 1;
                    if (nextMajor <= ReleaseTagVersion.maxMajor) {
                        successors.push(ReleaseTagVersion.fromVersionParts(null, nextMajor, 0, 0, "alpha", 0, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.PreRelease));
                        if (!closest) {
                            for (var i = 1; i <= ReleaseTagVersion.maxPreReleaseNameIdx; ++i) {
                                successors.push(ReleaseTagVersion.fromVersionParts(null, nextMajor, 0, 0, ReleaseTagVersion.standardNames[i], i, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.PreRelease));
                            }
                        }
                        successors.push(ReleaseTagVersion.fromVersionParts(null, nextMajor, 0, 0, "", -1, 0, 0, ReleaseTagVersion_1.ReleaseTagKind.Release));
                    }
                }
                return successors;
            };
            ReleaseTagVersion.prototype.isDirectPredecessor = function (previous) {
                if (!this.isValid)
                    return false;
                var num = this.sOrderedVersion.Number;
                if (previous == null)
                    return ReleaseTagVersion.firstPossibleVersions.indexOf(this) > -1;
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
            Object.defineProperty(ReleaseTagVersion, "maxMajor", {
                get: function () { return 99999; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "maxMinor", {
                get: function () { return 99999; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "maxPatch", {
                get: function () { return 9999; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "maxPreReleaseNameIdx", {
                get: function () { return 12; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "maxPreReleaseNumber", {
                get: function () { return 99; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "maxPreReleaseFix", {
                get: function () { return 99; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "standardNames", {
                get: function () {
                    return ["alpha", "beta", "delta", "epsilon", "gamma", "iota", "kappa", "lambda", "mu", "omicron", "pi", "prerelease", "rc"];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "mulNum", {
                get: function () {
                    return new Big(this.maxPreReleaseFix + 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "mulName", {
                get: function () {
                    return this.mulNum.times(this.maxPreReleaseNumber + 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "mulPatch", {
                get: function () {
                    return (this.mulName.times(this.maxPreReleaseNameIdx + 1)).plus(1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "mulMinor", {
                get: function () {
                    return this.mulPatch.times(this.maxPatch + 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "mulMajor", {
                get: function () {
                    return this.mulMinor.times(this.maxMinor + 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "divPatch", {
                get: function () {
                    return this.mulPatch.plus(1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "divMinor", {
                get: function () {
                    return this.divPatch.times(this.maxPatch);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "divMajor", {
                get: function () {
                    return this.divMinor.times(this.maxMinor + 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "standardPreReleaseNames", {
                get: function () {
                    return this.standardNames;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "veryFirstVersion", {
                get: function () {
                    return ReleaseTagVersion.fromDecimal(new Big(1));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "firstPossibleVersions", {
                get: function () {
                    return ReleaseTagVersion.buildFirstPossibleVersions();
                },
                enumerable: true,
                configurable: true
            });
            ReleaseTagVersion.buildFirstPossibleVersions = function () {
                var versions = new Array();
                var v = new Big(1);
                var i = 0;
                while (i < 3 * 14) {
                    versions[i++] = ReleaseTagVersion.fromDecimal(v);
                    if ((i % 28) == 0)
                        v = v.plus(this.mulMajor).minus(this.mulMinor).minus(this.mulPatch).plus(1);
                    else if ((i % 14) == 0)
                        v = v.plus(this.mulMinor).minus(this.mulPatch).plus(1);
                    else
                        v = v.plus(this.mulName);
                }
                return versions;
            };
            ReleaseTagVersion.computeOrderedVersion = function (major, minor, patch, preReleaseNameIdx, preReleaseNumber, preReleaseFix) {
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
                ReleaseTagVersion_1.Debug.assert(ReleaseTagVersion.fromDecimal(v).orderedVersion == v);
                ReleaseTagVersion_1.Debug.assert(preReleaseNameIdx >= 0 == (!v.mod(this.mulPatch).eq(0)));
                return v;
            };
            ReleaseTagVersion.prototype.computeDefinitionStrength = function () {
                var d = 3;
                if (this.isPreRelease && !this.isPreReleaseNameStandard)
                    d -= 1;
                if (this.isMarked)
                    d += 2;
                if (this.isMarkedPublished)
                    d += 2;
                if (this.isMarkedInvalid)
                    d += 4;
                return d;
            };
            Object.defineProperty(ReleaseTagVersion.prototype, "orderedVersion", {
                get: function () {
                    return this.sOrderedVersion.Number;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "orderedVersionMajor", {
                get: function () {
                    return this.sOrderedVersion.Major;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "orderedVersionMinor", {
                get: function () {
                    return this.sOrderedVersion.Minor;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "orderedVersionBuild", {
                get: function () {
                    return this.sOrderedVersion.Build;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion.prototype, "orderedVersionRevision", {
                get: function () {
                    return this.sOrderedVersion.Revision;
                },
                enumerable: true,
                configurable: true
            });
            ReleaseTagVersion.prototype.equals = function (other) {
                if (other == null)
                    return false;
                return this.sOrderedVersion.Number == other.sOrderedVersion.Number;
            };
            ReleaseTagVersion.prototype.compareTo = function (other) {
                if (other == null)
                    return 1;
                return this.sOrderedVersion.Number.cmp(other.sOrderedVersion.Number);
            };
            Object.defineProperty(ReleaseTagVersion, "noTagParseErrorMessage", {
                // ========== ReleaseTagVersion.Parse.cs ==========
                get: function () { return "Not a release tag."; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "regexStrict", {
                get: function () {
                    return /^v?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-([a-z]+)(?:\.(0|[1-9][0-9]?)(?:\.([1-9][0-9]?))?)?)?(?:\+(Valid|Invalid|Published)?)?$/i;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReleaseTagVersion, "regexApprox", {
                get: function () {
                    return /^(?:v|V)?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:\.(0|[1-9][0-9]*))?([^\n]*)?$/;
                },
                enumerable: true,
                configurable: true
            });
            ReleaseTagVersion.tryParse = function (s, analyseInvalidTag) {
                if (analyseInvalidTag === void 0) { analyseInvalidTag = false; }
                if (s == null)
                    throw new Error("ArgumentNullException");
                var m = this.regexStrict.exec(s);
                if (m == null || !m.length) {
                    if (analyseInvalidTag) {
                        m = this.regexApprox.exec(s);
                        if (m != null && m.length)
                            return ReleaseTagVersion.fromFailedParsing(s, true, this.syntaxErrorHelper(s, m));
                    }
                    return ReleaseTagVersion.fromFailedParsing(s, false, this.noTagParseErrorMessage);
                }
                var sMajor = m[1];
                var sMinor = m[2];
                var sPatch = m[3];
                var major = parseInt(sMajor);
                var minor = parseInt(sMinor);
                var patch = parseInt(sPatch);
                if (major == NaN || major > this.maxMajor)
                    return ReleaseTagVersion.fromFailedParsing(s, true, "Incorrect Major version. Must not be greater than " + this.maxMajor + ".");
                if (minor == NaN || minor > this.maxMinor)
                    return ReleaseTagVersion.fromFailedParsing(s, true, "Incorrect Minor version. Must not be greater than " + this.maxMinor + ".");
                if (patch == NaN || patch > this.maxPatch)
                    return ReleaseTagVersion.fromFailedParsing(s, true, "Incorrect Patch version. Must not be greater than " + this.maxPatch + ".");
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
                        return ReleaseTagVersion.fromFailedParsing(s, true, "Incorrect '.0' Release Number version. 0 can appear only to fix the first pre release (ie. '.0.F' where F is between 1 and " + this.maxPreReleaseFix + ").");
                }
                var kind = prNameIdx >= 0 ? ReleaseTagVersion_1.ReleaseTagKind.PreRelease : ReleaseTagVersion_1.ReleaseTagKind.Release;
                if (sBuildMetaData != null && sBuildMetaData.length > 0) {
                    if (sBuildMetaData[0] == "i" || sBuildMetaData[0] == "I")
                        kind |= ReleaseTagVersion_1.ReleaseTagKind.MarkedInvalid;
                    else if (sBuildMetaData[0] == 'v' || sBuildMetaData[0] == 'V')
                        kind |= ReleaseTagVersion_1.ReleaseTagKind.MarkedValid;
                    else
                        kind |= ReleaseTagVersion_1.ReleaseTagKind.MarkedPublished;
                }
                return ReleaseTagVersion.fromVersionParts(s, major, minor, patch, sPRName, prNameIdx, prNum, prFix, kind);
            };
            Object.defineProperty(ReleaseTagVersion, "regexApproxSuffix", {
                get: function () {
                    return /^(?:-([^\n]*?))?(?:\+([^\n]*))?$/;
                },
                enumerable: true,
                configurable: true
            });
            ReleaseTagVersion.syntaxErrorHelper = function (s, mApproximate) {
                if (mApproximate[3] != null && mApproximate[3].length == 0)
                    return "There must be at least 3 numbers (Major.Minor.Patch).";
                var buildMetaData = mApproximate[4];
                if (buildMetaData != null && buildMetaData.length > 0) {
                    var mSuffix = this.regexApproxSuffix.exec(buildMetaData);
                    if (mSuffix == null || mSuffix.length == 0)
                        return "Major.Minor.Patch must be followed by a '-' and a pre release name (ie. 'v1.0.2-alpha') and/or a '+invalid', '+valid' or '+published' build meta data.";
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
                        if (fragment.toLowerCase() != "invalid" && fragment.toLowerCase() != "valid" && fragment.toLowerCase() != "published") {
                            return "Invalid build meta data: can only be '+valid' or '+published', '+invalid'.";
                        }
                    }
                }
                return "Invalid tag. Valid examples are: '1.0.0', '1.0.0-beta', '1.0.0-beta.5', '1.0.0-rc.5.12', '3.0.12+invalid' or 7.2.3-gamma+published";
            };
            ReleaseTagVersion.getPreReleaseNameIdx = function (preReleaseName) {
                if (preReleaseName == null || preReleaseName.length == 0)
                    return -1;
                var prNameIdx = this.standardNames.indexOf(preReleaseName);
                if (prNameIdx < 0)
                    prNameIdx = this.maxPreReleaseNameIdx - 1;
                return prNameIdx;
            };
            // ========== ReleaseTagVersion.ToString.cs ==========
            ReleaseTagVersion.prototype.toString = function (f, usePreReleaseNameFromTag) {
                if (f === void 0) { f = ReleaseTagVersion_1.Format.Normalized; }
                if (usePreReleaseNameFromTag === void 0) { usePreReleaseNameFromTag = false; }
                if (this.parseErrorMessage != null)
                    return this.parseErrorMessage;
                if (f == ReleaseTagVersion_1.Format.DottedOrderedVersion) {
                    return this.orderedVersionMajor + "." + this.orderedVersionMinor + "." + this.orderedVersionBuild + "." + this.orderedVersionRevision;
                }
                var prName = usePreReleaseNameFromTag ? this.preReleaseNameFromTag : this.preReleaseName;
                switch (f) {
                    case ReleaseTagVersion_1.Format.NugetPackageV2: {
                        var marker = this.isMarkedInvalid ? this.marker : null;
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
                    case ReleaseTagVersion_1.Format.SemVer:
                    case ReleaseTagVersion_1.Format.SemVerWithMarker: {
                        var marker = f == ReleaseTagVersion_1.Format.SemVerWithMarker ? this.marker : null;
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
                        ReleaseTagVersion_1.Debug.assert(f == ReleaseTagVersion_1.Format.Normalized);
                        if (this.isPreRelease) {
                            if (this.isPreReleaseFix) {
                                return "v" + this.major + "." + this.minor + "." + this.patch + "-" + prName + "." + this.preReleaseNumber + "." + this.preReleaseFix + this.marker;
                            }
                            if (this.preReleaseNumber > 0) {
                                return "v" + this.major + "." + this.minor + "." + this.patch + "-" + prName + "." + this.preReleaseNumber + this.marker;
                            }
                            return "v" + this.major + "." + this.minor + "." + this.patch + "-" + prName + this.marker;
                        }
                        return "v" + this.major + "." + this.minor + "." + this.patch + this.marker;
                    }
                }
            };
            return ReleaseTagVersion;
        })();
        ReleaseTagVersion_1.ReleaseTagVersion = ReleaseTagVersion;
    })(ReleaseTagVersion = CSemVerPlayground.ReleaseTagVersion || (CSemVerPlayground.ReleaseTagVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
var CSemVerPlayground;
(function (CSemVerPlayground) {
    var ReleaseTagVersion;
    (function (ReleaseTagVersion) {
        var SOrderedVersion = (function () {
            function SOrderedVersion() {
            }
            return SOrderedVersion;
        })();
        ReleaseTagVersion.SOrderedVersion = SOrderedVersion;
    })(ReleaseTagVersion = CSemVerPlayground.ReleaseTagVersion || (CSemVerPlayground.ReleaseTagVersion = {}));
})(CSemVerPlayground || (CSemVerPlayground = {}));
//# sourceMappingURL=CSemVerPlayground.ReleaseTagVersion.js.map