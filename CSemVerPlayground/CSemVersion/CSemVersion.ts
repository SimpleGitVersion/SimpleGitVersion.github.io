module CSemVerPlayground.CSemVersion {
    export class CSemVersion implements IEquatable<CSemVersion>, IComparable<CSemVersion> {
        // ========== Static constructors ==========
        public static fromVersionParts(tag: string, major: number, minor: number, patch: number, preReleaseName: string, preReleaseNameIdx: number, preReleaseNumber: number, preReleaseFix: number, marker: string, kind: ReleaseTagKind): CSemVersion {
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

            v.sOrderedVersion = new SOrderedVersion();
            v.sOrderedVersion.Number = this.computeOrderedVersion(major, minor, patch, preReleaseNameIdx, preReleaseNumber, preReleaseFix);

            return v;
        }

        public static fromDecimal(d: BigJsLibrary.BigJS): CSemVersion {
            var v = new CSemVersion();

            if (d.eq(0)) {
                v.kind = ReleaseTagKind.None;
                v.parseErrorMessage = this.noTagParseErrorMessage;
                v.preReleaseNameIdx = -1;
            }
            else {
                v.sOrderedVersion = new SOrderedVersion();
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
                    v.kind = ReleaseTagKind.PreRelease;
                }
                else {
                    d = d.minus(this.mulPatch);
                    v.preReleaseNameIdx = -1;
                    v.preReleaseNameFromTag = "";
                    v.kind = ReleaseTagKind.Release;
                }

                v.major = parseInt(d.div(this.mulMajor).toFixed());
                d = d.minus(this.mulMajor.times(v.major));

                v.minor = parseInt(d.div(this.mulMinor).toFixed());
                d = d.minus(this.mulMinor.times(v.minor));

                v.patch = parseInt(d.div(this.mulPatch).toFixed());
            }

            return v;
        }

        public static fromFailedParsing(tag: string, isMalformed: boolean, errorMessage: string): CSemVersion {
            var v = new CSemVersion();

            v.originalTagText = tag;
            v.kind = ReleaseTagKind.None;

            if (isMalformed) {
                v.kind = ReleaseTagKind.Malformed;
            }

            v.parseErrorMessage = isMalformed ? `Tag '${tag}': ${errorMessage}` : errorMessage;
            v.preReleaseNameIdx = -1;
            v.preReleaseFix = 0;

            return v;
        }

        // ========== ReleaseTagVersion.cs ==========
        public major: number;

        public minor: number;

        public patch: number;

        public preReleaseNameFromTag: string;

        public get preReleaseName(): string {
            return this.isPreRelease ? CSemVersion.standardNames[this.preReleaseNameIdx] : "";
        }

        public get isPreRelease(): boolean {
            return this.preReleaseNameIdx >= 0;
        }

        public preReleaseNameIdx: number;

        public get isPreReleaseNameStandard(): boolean {
            return this.isPreRelease && (this.preReleaseNameIdx != CSemVersion.maxPreReleaseNameIdx - 1 || this.preReleaseNameFromTag.toLowerCase() == CSemVersion.standardNames[CSemVersion.maxPreReleaseNameIdx - 1]);
        }

        public preReleaseNumber: number;

        public preReleaseFix: number;

        public get isPreReleaseFix(): boolean {
            return this.preReleaseFix > 0;
        }

        public marker = "";

        public get isValid(): boolean {
            return this.preReleaseNameFromTag != null;
        }

        public kind: ReleaseTagKind;

        public get isMalformed(): boolean {
            return (this.kind & ReleaseTagKind.Malformed) != 0;
        }

        public parseErrorMessage: string;

        public originalTagText: string;

        public getDirectSuccessors(closest: boolean = false): Array<CSemVersion> {
            var successors = new Array<CSemVersion>();

            if (this.isValid) {
                if (this.isPreRelease) {
                    var nextFix = this.preReleaseFix + 1;
                    if (nextFix <= CSemVersion.maxPreReleaseFix) {
                        successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, this.patch, this.preReleaseName, this.preReleaseNameIdx, this.preReleaseNumber, nextFix, null, ReleaseTagKind.PreRelease));
                    }

                    var nextPrereleaseNumber = this.preReleaseNumber + 1;
                    if (nextPrereleaseNumber <= CSemVersion.maxPreReleaseNumber) {
                        successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, this.patch, this.preReleaseName, this.preReleaseNameIdx, nextPrereleaseNumber, 0, null, ReleaseTagKind.PreRelease));
                    }

                    var nextPrereleaseNameIdx = this.preReleaseNameIdx + 1;
                    if (nextPrereleaseNameIdx <= CSemVersion.maxPreReleaseNameIdx) {
                        successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, this.patch, CSemVersion.standardNames[nextPrereleaseNameIdx], nextPrereleaseNameIdx, 0, 0, null, ReleaseTagKind.PreRelease));

                        if (!closest) {
                            while (++nextPrereleaseNameIdx <= CSemVersion.maxPreReleaseNameIdx) {
                                successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, this.patch, CSemVersion.standardNames[nextPrereleaseNameIdx], nextPrereleaseNameIdx, 0, 0, null, ReleaseTagKind.PreRelease));
                            }
                        }
                    }

                    successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, this.patch, "", -1, 0, 0, null, ReleaseTagKind.Release));
                }
                else {
                    var nextPatch = this.patch + 1;
                    if (nextPatch <= CSemVersion.maxPatch) {
                        successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, nextPatch, "alpha", 0, 0, 0, null, ReleaseTagKind.PreRelease));

                        if (!closest) {
                            for (var i = 1; i <= CSemVersion.maxPreReleaseNameIdx; ++i) {
                                successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, nextPatch, CSemVersion.standardNames[i], i, 0, 0, null, ReleaseTagKind.PreRelease));
                            }
                        }

                        successors.push(CSemVersion.fromVersionParts(null, this.major, this.minor, nextPatch, "", -1, 0, 0, null, ReleaseTagKind.Release));
                    }
                }

                var nextMinor = this.minor + 1;
                if (nextMinor <= CSemVersion.maxMinor) {
                    successors.push(CSemVersion.fromVersionParts(null, this.major, nextMinor, 0, "alpha", 0, 0, 0, null, ReleaseTagKind.PreRelease));

                    if (!closest) {
                        for (var i = 1; i <= CSemVersion.maxPreReleaseNameIdx; ++i) {
                            successors.push(CSemVersion.fromVersionParts(null, this.major, nextMinor, 0, CSemVersion.standardNames[i], i, 0, 0, null, ReleaseTagKind.PreRelease));
                        }
                    }

                    successors.push(CSemVersion.fromVersionParts(null, this.major, nextMinor, 0, "", -1, 0, 0, null, ReleaseTagKind.Release));
                }

                var nextMajor = this.major + 1;
                if (nextMajor <= CSemVersion.maxMajor) {
                    successors.push(CSemVersion.fromVersionParts(null, nextMajor, 0, 0, "alpha", 0, 0, 0, null, ReleaseTagKind.PreRelease));

                    if (!closest) {
                        for (var i = 1; i <= CSemVersion.maxPreReleaseNameIdx; ++i) {
                            successors.push(CSemVersion.fromVersionParts(null, nextMajor, 0, 0, CSemVersion.standardNames[i], i, 0, 0, null, ReleaseTagKind.PreRelease));
                        }
                    }

                    successors.push(CSemVersion.fromVersionParts(null, nextMajor, 0, 0, "", -1, 0, 0, null, ReleaseTagKind.Release));
                }
            }

            return successors;
        }

        public isDirectPredecessor(previous: CSemVersion): boolean {
            if (!this.isValid) return false;

            var num = this.sOrderedVersion.Number;
            if (previous == null) return CSemVersion.firstPossibleVersions.indexOf(this) > -1;
            if (previous.sOrderedVersion.Number.gte(num)) return false;
            if (previous.sOrderedVersion.Number.eq(num.minus(1))) return true;

            if (this.major > previous.major + 1) return false;

            if (this.major != previous.major) {
                return this.minor == 0 && this.patch == 0 && this.preReleaseNumber == 0 && this.preReleaseFix == 0;
            }

            if (this.minor > previous.minor + 1) return false;

            if (this.minor != previous.minor) {
                return this.patch == 0 && this.preReleaseNumber == 0 && this.preReleaseFix == 0;
            }

            if (this.patch > previous.patch + 1) return false;

            if (this.patch != previous.patch) {
                if (previous.isPreRelease) return false;
                return this.preReleaseNumber == 0 && this.preReleaseFix == 0;
            }

            if (!this.isPreRelease) return true;

            if (this.preReleaseFix > 0) return false;

            if (this.preReleaseNumber > 0) {
                if (previous.preReleaseNameIdx == this.preReleaseNameIdx) {
                    return true;
                }

                return false;
            }

            return true;
        }

        // ========== ReleaseTagVersion.OrderedVersion.cs ==========
        private sOrderedVersion: SOrderedVersion;

        public static get maxMajor(): number { return 99999; }

        public static get maxMinor(): number { return 99999; }

        public static get maxPatch(): number { return 9999; }

        public static get maxPreReleaseNameIdx(): number { return 12; }

        public static get maxPreReleaseNumber(): number { return 99; }

        public static get maxPreReleaseFix(): number { return 99; }

        private static get standardNames(): string[] {
            return ["alpha", "beta", "delta", "epsilon", "gamma", "iota", "kappa", "lambda", "mu", "omicron", "pi", "prerelease", "rc"];
        }

        public static get mulNum(): BigJsLibrary.BigJS {
            return new Big(this.maxPreReleaseFix + 1);
        }

        public static get mulName(): BigJsLibrary.BigJS {
            return this.mulNum.times(this.maxPreReleaseNumber + 1);
        }

        public static get mulPatch(): BigJsLibrary.BigJS {
            return (this.mulName.times(this.maxPreReleaseNameIdx + 1)).plus(1);
        }

        public static get mulMinor(): BigJsLibrary.BigJS {
            return this.mulPatch.times(this.maxPatch + 1);
        }

        public static get mulMajor(): BigJsLibrary.BigJS {
            return this.mulMinor.times(this.maxMinor + 1);
        }

        public static get divPatch(): BigJsLibrary.BigJS {
            return this.mulPatch.plus(1);
        }

        public static get divMinor(): BigJsLibrary.BigJS {
            return this.divPatch.times(this.maxPatch);
        }

        public static get divMajor(): BigJsLibrary.BigJS {
            return this.divMinor.times(this.maxMinor + 1);
        }

        public static get standardPreReleaseNames(): Array<string> {
            return this.standardNames;
        }

        public static get veryFirstVersion(): CSemVersion {
            return CSemVersion.fromDecimal(new Big(1));
        }

        public static get firstPossibleVersions(): Array<CSemVersion> {
            return CSemVersion.buildFirstPossibleVersions();
        }

        private static buildFirstPossibleVersions(): Array<CSemVersion> {
            var versions = new Array<CSemVersion>();
            var v = new Big(1);
            var i = 0;

            while (i < 3 * 14) {
                versions[i++] = CSemVersion.fromDecimal(v);

                if ((i % 28) == 0) v = v.plus(this.mulMajor).minus(this.mulMinor).minus(this.mulPatch).plus(1);
                else if ((i % 14) == 0) v = v.plus(this.mulMinor).minus(this.mulPatch).plus(1);
                else v = v.plus(this.mulName);
            }

            return versions;
        }

        private static computeOrderedVersion(major: number, minor: number, patch: number, preReleaseNameIdx: number = -1, preReleaseNumber: number = 0, preReleaseFix: number = 0): BigJsLibrary.BigJS {
            var v = this.mulMajor.times(major); 
            v = v.plus(this.mulMinor.times(minor));
            v = v.plus(this.mulPatch.times(patch + 1)); 

            if (preReleaseNameIdx >= 0) {
                v = v.minus(this.mulPatch.minus(1));
                v = v.plus(this.mulName.times(preReleaseNameIdx));
                v = v.plus(this.mulNum.times(preReleaseNumber)); 
                v = v.plus(preReleaseFix);
            }

            Debug.assert(CSemVersion.fromDecimal(v).orderedVersion == v);
            Debug.assert(preReleaseNameIdx >= 0 == (!v.mod(this.mulPatch).eq(0)));

            return v;
        }

        public get orderedVersion(): BigJsLibrary.BigJS {
            return this.sOrderedVersion.Number;
        }

        public get orderedVersionMajor(): number {
            return this.sOrderedVersion.Major;
        }

        public get orderedVersionMinor(): number {
            return this.sOrderedVersion.Minor;
        }

        public get orderedVersionBuild(): number {
            return this.sOrderedVersion.Build;
        }

        public get orderedVersionRevision(): number {
            return this.sOrderedVersion.Revision;
        }

        public equals(other: CSemVersion): boolean {
            if (other == null) return false;
            return this.sOrderedVersion.Number == other.sOrderedVersion.Number;
        }

        public compareTo(other: CSemVersion): number {
            if (other == null) return 1;
            
            return this.sOrderedVersion.Number.cmp(other.sOrderedVersion.Number);
        }

        // ========== ReleaseTagVersion.Parse.cs ==========
        public static get noTagParseErrorMessage(): string { return "Not a valid tag."; }

        private static get regexStrict(): RegExp {
            return /^v?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-([a-z]+)(?:\.(0|[1-9][0-9]?)(?:\.([1-9][0-9]?))?)?)?(?:\+([0-9a-z-]+(?:\.[0-9a-z-]+)*))?$/i;
        }

        private static get regexApprox(): RegExp {
            return /^(?:v|V)?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:\.(0|[1-9][0-9]*))?([^\n]*)?$/;
        }

        public static tryParse(s: string, analyseInvalidTag: boolean = false): CSemVersion {
            if (s == null) throw new Error("ArgumentNullException");

            var m = this.regexStrict.exec(s);

            if (m == null || !m.length) {
                if (analyseInvalidTag) {
                    m = this.regexApprox.exec(s);

                    if (m != null && m.length) return CSemVersion.fromFailedParsing(s, true, this.syntaxErrorHelper(s, m));
                }
                return CSemVersion.fromFailedParsing(s, false, this.noTagParseErrorMessage);
            }

            var sMajor = m[1];
            var sMinor = m[2];
            var sPatch = m[3];

            var major = parseInt(sMajor);
            var minor = parseInt(sMinor);
            var patch = parseInt(sPatch);

            if (major == NaN || major > this.maxMajor) return CSemVersion.fromFailedParsing(s, true, `Incorrect Major version. Must not be greater than ${this.maxMajor}.`);
            if (minor == NaN || minor > this.maxMinor) return CSemVersion.fromFailedParsing(s, true, `Incorrect Minor version. Must not be greater than ${this.maxMinor}.`);
            if (patch == NaN || patch > this.maxPatch) return CSemVersion.fromFailedParsing(s, true, `Incorrect Patch version. Must not be greater than ${this.maxPatch}.`);

            var sPRName = m[4];
            var sPRNum = m[5];
            var sPRFix = m[6];
            var sBuildMetaData = m[7];

            var prNameIdx = this.getPreReleaseNameIdx(sPRName);
            var prNum = 0;
            var prFix = 0;

            if (prNameIdx >= 0) {
                if (sPRFix != null && sPRFix.length > 0) prFix = parseInt(sPRFix);
                if (sPRNum != null && sPRNum.length > 0) prNum = parseInt(sPRNum);
                if (prFix == 0 && prNum == 0 && (sPRNum != null && sPRNum.length > 0)) return CSemVersion.fromFailedParsing(s, true, `Incorrect '.0' Release Number version. 0 can appear only to fix the first pre release (ie. '.0.F' where F is between 1 and ${this.maxPreReleaseFix}).`);
            }

            var kind = prNameIdx >= 0 ? ReleaseTagKind.PreRelease : ReleaseTagKind.Release;
            var marker = sBuildMetaData;

            return CSemVersion.fromVersionParts(s, major, minor, patch, sPRName, prNameIdx, prNum, prFix, sBuildMetaData, kind);
        }

        private static get regexApproxSuffix(): RegExp {
            return /^(?:-([^\n]*?))?(?:\+([^\n]*))?$/;
        }

        private static syntaxErrorHelper(s: string, mApproximate: RegExpExecArray): string {
            if (mApproximate[3] != null && mApproximate[3].length == 0) return "There must be at least 3 numbers (Major.Minor.Patch).";
            var buildMetaData = mApproximate[4];

            if (buildMetaData != null && buildMetaData.length > 0) {
                var mSuffix = this.regexApproxSuffix.exec(buildMetaData);

                if (mSuffix == null || mSuffix.length == 0) return "Major.Minor.Patch must be followed by a '-' and a pre release name (ie. 'v1.0.2-alpha') and/or a build metadata.";

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
                            return `Pre Release Number must be between 1 and ${this.maxPreReleaseNumber}.`;
                        }

                        if (dotParts.length > 2) {
                            var prFix = parseInt(dotParts[2]);

                            if (prFix == NaN || prFix < 1 || prFix > this.maxPreReleaseFix) {
                                return `Fix Number must be between 1 and ${this.maxPreReleaseFix}.`;
                            }
                        }
                        else if (prNum == 0) return `Incorrect '.0' release Number version. 0 can appear only to fix the first pre release (ie. '.0.XX' where XX is between 1 and ${this.maxPreReleaseFix}).`;
                    }
                    if (dotParts.length > 3) return "Too much parts: there can be at most two trailing numbers like in '-alpha.1.2'.";
                }

                if (fragment != null && fragment.length > 0) {
                    return "Invalid build metadata. Valid examples are: '+001', '+20130313144700', or '1.0.0-beta+exp.sha.5114f85'.";
                }
            }

            return "Invalid tag. Valid examples are: '1.0.0', '1.0.0-beta', '1.0.0-beta.5', '1.0.0-rc.5.12', '3.0.12+001' or 7.2.3-gamma+published";
        }

        public static getPreReleaseNameIdx(preReleaseName: string): number {
            if (preReleaseName == null || preReleaseName.length == 0) return -1;
            var prNameIdx = this.standardNames.indexOf(preReleaseName);
            if (prNameIdx < 0) prNameIdx = this.maxPreReleaseNameIdx - 1;
            return prNameIdx;
        }

        // ========== ReleaseTagVersion.ToString.cs ==========
        public toString(f: Format = Format.Normalized, usePreReleaseNameFromTag: boolean = false): string {
            if (this.parseErrorMessage != null) return this.parseErrorMessage;

            if (f == Format.DottedOrderedVersion) {
                return `${this.orderedVersionMajor}.${this.orderedVersionMinor}.${this.orderedVersionBuild}.${this.orderedVersionRevision}`;
            }

            var prName = usePreReleaseNameFromTag ? this.preReleaseNameFromTag : this.preReleaseName;

            switch (f) {
                case Format.NugetPackageV2: {
                    var marker = this.marker != "" ? "+" + this.marker : "";

                    if (this.isPreRelease) {
                        if (this.isPreReleaseFix) {
                            return `${this.major}.${this.minor}.${this.patch}-${prName}-${this.preReleaseNumber}-${this.preReleaseFix}${marker}`;
                        }

                        if (this.preReleaseNumber > 0) {
                            return `${this.major}.${this.minor}.${this.patch}-${prName}-${this.preReleaseNumber}${marker}`;
                        }

                        return `${this.major}.${this.minor}.${this.patch}-${prName}${marker}`;
                    }

                    return `${this.major}.${this.minor}.${this.patch}${marker}`;
                }

                case Format.SemVer:
                case Format.SemVerWithMarker: {
                    var marker = f == Format.SemVerWithMarker && this.marker != "" ? "+" + this.marker : "";

                    if (this.isPreRelease) {
                        if (this.isPreReleaseFix) {
                            return `${this.major}.${this.minor}.${this.patch}-${prName}.${this.preReleaseNumber}.${this.preReleaseFix}${marker}`;
                        }

                        if (this.preReleaseNumber > 0) {
                            return `${this.major}.${this.minor}.${this.patch}-${prName}.${this.preReleaseNumber}${marker}`;
                        }

                        return `${this.major}.${this.minor}.${this.patch}-${prName}${marker}`;
                    }

                    return `${this.major}.${this.minor}.${this.patch}${marker}`;
                }

                default: {
                    Debug.assert(f == Format.Normalized);
                    var marker = this.marker != "" ? "+" + this.marker : "";

                    if (this.isPreRelease) {
                        if (this.isPreReleaseFix) {
                            return `v${this.major}.${this.minor}.${this.patch}-${prName}.${this.preReleaseNumber}.${this.preReleaseFix}${marker}`;
                        }

                        if (this.preReleaseNumber > 0) {
                            return `v${this.major}.${this.minor}.${this.patch}-${prName}.${this.preReleaseNumber}${marker}`;
                        }

                        return `v${this.major}.${this.minor}.${this.patch}-${prName}${marker}`;
                    }

                    return `v${this.major}.${this.minor}.${this.patch}${marker}`;
                }
            }
        }
    }
}