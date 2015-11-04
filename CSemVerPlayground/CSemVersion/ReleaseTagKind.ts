module CSemVerPlayground.CSemVersion {
    export enum ReleaseTagKind {
        // Not a release tag.
        None = 0,
        
        // The tag looks like a release tag but is syntaxically incorrect.
        Malformed = 1,

        // This release tag is 'Major.Minor.Patch' only.
        OfficialRelease = 2,

        // This release tag is 'Major.Minor.Patch-prerelease[.Number[.Fix]]'.
        PreRelease = 4,

        /// This release tag is +Invalid.
        MarkedInvalid = 8
    }
} 