declare module BigJsLibrary {
    class Extensions {
        static leftShift(nbr: BigJsLibrary.BigJS, shift: number): BigJS;
        static rightShift(nbr: BigJsLibrary.BigJS, shift: number): BigJS;
    }
}
declare module CSemVerPlayground.CSemVersion {
    class CIBuildDescriptor {
        static maxNuGetV2BuildIndex: number;
        private _buildIndex;
        buildIndex: number;
        branchName: string;
        isValid: boolean;
        isValidForNuGetV2: boolean;
        toString(): string;
        toStringForNuGetV2(): string;
    }
}
declare module CSemVerPlayground.CSemVersion {
    class CSemVersion implements IEquatable<CSemVersion>, IComparable<CSemVersion> {
        private static fromVersionParts(tag, major, minor, patch, preReleaseName, preReleaseNameIdx, preReleaseNumber, preReleaseFix, marker, kind);
        private static fromFileVersionParts(major, minor, build, revision);
        private static fromFailedParsing(input, isMalformed, errorMessage, isFileVersion?);
        static fromDecimal(d: BigJsLibrary.BigJS): CSemVersion;
        major: number;
        minor: number;
        patch: number;
        preReleaseNameFromTag: string;
        preReleaseName: string;
        isPreRelease: boolean;
        preReleaseNameIdx: number;
        isPreReleaseNameStandard: boolean;
        preReleaseNumber: number;
        preReleaseFix: number;
        isPreReleaseFix: boolean;
        marker: string;
        isValid: boolean;
        kind: ReleaseTagKind;
        isMalformed: boolean;
        isMarkedInvalid: boolean;
        parseErrorMessage: string;
        originalTagText: string;
        getDirectSuccessors(closest?: boolean): Array<CSemVersion>;
        isDirectPredecessor(previous: CSemVersion): boolean;
        private sOrderedVersion;
        static maxMajor: number;
        static maxMinor: number;
        static maxPatch: number;
        static maxPreReleaseNameIdx: number;
        static maxPreReleaseNumber: number;
        static maxPreReleaseFix: number;
        static maxFileVersionPart: number;
        private static standardNames;
        static mulNum: BigJsLibrary.BigJS;
        static mulName: BigJsLibrary.BigJS;
        static mulPatch: BigJsLibrary.BigJS;
        static mulMinor: BigJsLibrary.BigJS;
        static mulMajor: BigJsLibrary.BigJS;
        static divPatch: BigJsLibrary.BigJS;
        static divMinor: BigJsLibrary.BigJS;
        static divMajor: BigJsLibrary.BigJS;
        static standardPreReleaseNames: Array<string>;
        static veryFirstVersion: CSemVersion;
        static firstPossibleVersions: Array<CSemVersion>;
        private static buildFirstPossibleVersions();
        private static computeOrderedVersion(major, minor, patch, preReleaseNameIdx?, preReleaseNumber?, preReleaseFix?);
        orderedVersion: BigJsLibrary.BigJS;
        orderedVersionMajor: number;
        orderedVersionMinor: number;
        orderedVersionBuild: number;
        orderedVersionRevision: number;
        equals(other: CSemVersion): boolean;
        compareTo(other: CSemVersion): number;
        static noTagParseErrorMessage: string;
        static noFileVersionParseErrorMessage: string;
        static tryParseFileVersion(s: string): CSemVersion;
        private static regexStrictFileVersion;
        private static regexStrict;
        private static regexApprox;
        static tryParse(s: string, analyseInvalidTag?: boolean): CSemVersion;
        private static regexApproxSuffix;
        private static syntaxErrorHelper(s, mApproximate);
        static getPreReleaseNameIdx(preReleaseName: string): number;
        toStringFileVersion(): string;
        toString(f?: Format, usePreReleaseNameFromTag?: boolean): string;
    }
}
declare module CSemVerPlayground.CSemVersion {
    class Debug {
        static assert(condition: boolean, error?: string): void;
    }
}
declare module CSemVerPlayground.CSemVersion {
    enum Format {
        Normalized = 0,
        SemVer = 1,
        SemVerWithMarker = 2,
        FileVersion = 3,
        NugetPackageV2 = 4,
        NuGetPackage = 4,
        Default = 0,
    }
}
declare module CSemVerPlayground.CSemVersion {
    interface IComparable<T> {
        compareTo(other: T): number;
    }
}
declare module CSemVerPlayground.CSemVersion {
    interface IEquatable<T> {
        equals(other: T): boolean;
    }
}
declare module CSemVerPlayground.CSemVersion {
    enum ReleaseTagKind {
        None = 0,
        Malformed = 1,
        OfficialRelease = 2,
        PreRelease = 4,
        MarkedInvalid = 8,
    }
}
declare module CSemVerPlayground.CSemVersion {
    enum ReleaseType {
    }
}
declare module CSemVerPlayground.CSemVersion {
    class SOrderedVersion {
        private number;
        private major;
        private minor;
        private build;
        private revision;
        constructor(n: BigJsLibrary.BigJS);
        Number: BigJsLibrary.BigJS;
        Major: number;
        Minor: number;
        Build: number;
        Revision: number;
    }
}
declare module CSemVerPlayground.CSemVersion {
    class String {
        static isNullOrWhiteSpace(str: string): boolean;
        static fillWith(str: string, fillChar: string, lengthNeeded: number): string;
    }
}
