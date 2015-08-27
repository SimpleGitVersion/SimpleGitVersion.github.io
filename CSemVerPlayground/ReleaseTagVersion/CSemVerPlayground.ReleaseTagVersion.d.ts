declare module CSemVerPlayground.ReleaseTagVersion {
    class Debug {
        static assert(condition: boolean, error?: string): void;
    }
}
declare module CSemVerPlayground.ReleaseTagVersion {
    enum Format {
        Normalized = 0,
        SemVer = 1,
        SemVerWithMarker = 2,
        DottedOrderedVersion = 3,
        NugetPackageV2 = 4,
        NuGetPackage = 4,
        Default = 0,
    }
}
declare module CSemVerPlayground.ReleaseTagVersion {
    interface IComparable<T> {
        compareTo(other: T): number;
    }
}
declare module CSemVerPlayground.ReleaseTagVersion {
    interface IEquatable<T> {
        equals(other: T): boolean;
    }
}
declare module CSemVerPlayground.ReleaseTagVersion {
    enum ReleaseTagKind {
        None = 0,
        Malformed = 1,
        Release = 2,
        PreRelease = 4,
        MarkedValid = 8,
        MarkedPublished = 16,
        MarkedInvalid = 32,
    }
    class ReleaseTagKindExtensions {
        static isMarked(kind: ReleaseTagKind): boolean;
        static isMarkedValid(kind: ReleaseTagKind): boolean;
        static isMarkedPublished(kind: ReleaseTagKind): boolean;
        static isMarkedInvalid(kind: ReleaseTagKind): boolean;
        static clearMarker(kind: ReleaseTagKind): ReleaseTagKind;
        static toStringMarker(kind: ReleaseTagKind, prefixPlus?: boolean): string;
    }
}
declare module CSemVerPlayground.ReleaseTagVersion {
    class ReleaseTagVersion implements IEquatable<ReleaseTagVersion>, IComparable<ReleaseTagVersion> {
        static fromVersionParts(tag: string, major: number, minor: number, patch: number, preReleaseName: string, preReleaseNameIdx: number, preReleaseNumber: number, preReleaseFix: number, kind: ReleaseTagKind): ReleaseTagVersion;
        static fromDecimal(d: BigJsLibrary.BigJS): ReleaseTagVersion;
        static fromFailedParsing(tag: string, isMalformed: boolean, errorMessage: string): ReleaseTagVersion;
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
        isMarked: boolean;
        isMarkedValid: boolean;
        isMarkedPublished: boolean;
        isMarkedInvalid: boolean;
        definitionStrength: number;
        kind: ReleaseTagKind;
        isMalformed: boolean;
        parseErrorMessage: string;
        originalTagText: string;
        markValid(): ReleaseTagVersion;
        markInvalid(): ReleaseTagVersion;
        getDirectSuccessors(closest?: boolean): Array<ReleaseTagVersion>;
        isDirectPredecessor(previous: ReleaseTagVersion): boolean;
        private sOrderedVersion;
        static maxMajor: number;
        static maxMinor: number;
        static maxPatch: number;
        static maxPreReleaseNameIdx: number;
        static maxPreReleaseNumber: number;
        static maxPreReleaseFix: number;
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
        static veryFirstVersion: ReleaseTagVersion;
        static firstPossibleVersions: Array<ReleaseTagVersion>;
        private static buildFirstPossibleVersions();
        private static computeOrderedVersion(major, minor, patch, preReleaseNameIdx?, preReleaseNumber?, preReleaseFix?);
        computeDefinitionStrength(): number;
        orderedVersion: BigJsLibrary.BigJS;
        orderedVersionMajor: number;
        orderedVersionMinor: number;
        orderedVersionBuild: number;
        orderedVersionRevision: number;
        equals(other: ReleaseTagVersion): boolean;
        compareTo(other: ReleaseTagVersion): number;
        static noTagParseErrorMessage: string;
        private static regexStrict;
        private static regexApprox;
        static tryParse(s: string, analyseInvalidTag?: boolean): ReleaseTagVersion;
        private static regexApproxSuffix;
        private static syntaxErrorHelper(s, mApproximate);
        static getPreReleaseNameIdx(preReleaseName: string): number;
        toString(f?: Format, usePreReleaseNameFromTag?: boolean): string;
    }
}
declare module CSemVerPlayground.ReleaseTagVersion {
    class SOrderedVersion {
        Number: BigJsLibrary.BigJS;
        Major: number;
        Minor: number;
        Build: number;
        Revision: number;
    }
}
