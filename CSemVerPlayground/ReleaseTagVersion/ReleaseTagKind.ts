module CSemVerPlayground.ReleaseTagVersion {
    export enum ReleaseTagKind {
        // Not a release tag.
        None = 0,
        
        // The tag looks like a release tag but is syntaxically incorrect.
        Malformed = 1,

        // This release tag is 'Major.Minor.Patch' only.
        Release = 2,

        // This release tag is 'Major.Minor.Patch-prerelease[.Number[.Fix]]'.
        PreRelease = 4,

        // This release tag is +Valid.
        MarkedValid = 8,

        // This release tag is +Published.
        MarkedPublished = 16,

        // This release tag is +Invalid.
        MarkedInvalid = 32
    }

    export class ReleaseTagKindExtensions {
        public static isMarked(kind: ReleaseTagKind): boolean {
            return (kind & (ReleaseTagKind.MarkedValid | ReleaseTagKind.MarkedPublished | ReleaseTagKind.MarkedInvalid)) != 0;
        }

        public static isMarkedValid(kind: ReleaseTagKind): boolean {
            return (kind & ReleaseTagKind.MarkedValid) != 0;
        }

        public static isMarkedPublished(kind: ReleaseTagKind): boolean {
            return (kind & ReleaseTagKind.MarkedPublished) != 0;
        }

        public static isMarkedInvalid(kind: ReleaseTagKind): boolean {
            return (kind & ReleaseTagKind.MarkedInvalid) != 0;
        }

        public static clearMarker(kind: ReleaseTagKind): ReleaseTagKind {
            return kind & ~(ReleaseTagKind.MarkedValid | ReleaseTagKind.MarkedPublished | ReleaseTagKind.MarkedInvalid);
        }

        public static toStringMarker(kind: ReleaseTagKind, prefixPlus: boolean = true): string {
            switch (kind & (ReleaseTagKind.MarkedValid | ReleaseTagKind.MarkedPublished | ReleaseTagKind.MarkedInvalid)) {
                case ReleaseTagKind.MarkedValid: return prefixPlus ? "+valid" : "valid";
                case ReleaseTagKind.MarkedPublished: return prefixPlus ? "+published" : "published";
                case ReleaseTagKind.MarkedInvalid: return prefixPlus ? "+invalid" : "invalid";
            }

            return "";
        }
    }
} 