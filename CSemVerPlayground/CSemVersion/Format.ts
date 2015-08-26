module CSemVerPlayground.CSemVersion {
    export enum Format {
        // Normalized format is 'v' + <see cref="SemVerWithMarker"/>.
        // This is the default.
        Normalized,

        // Semantic version format.
        // The prerelease name is the standard one (ie. 'prerelease' for any unknown name) and there is no build meata data.
        SemVer,

        // Semantic version format.
        // The prerelease name is the standard one (ie. 'prerelease' for any unknown name) plus build meata data (+valid, +published or +invalid).
        SemVerWithMarker,

        // The ordered version in dotted notation (1542.6548.777.8787) where each parts are between 0 and 65535.
        DottedOrderedVersion,

        // NuGet version 2. If the <see cref="CSemVersion.IsMarkedInvalid"/> the "+invalid" build meta data is added.
        NugetPackageV2,

        // NuGet format. Currently <see cref="NugetPackageV2"/>.
        NuGetPackage = NugetPackageV2,

        // Default is <see cref="SemVerWithMarker"/>.
        Default = Normalized
    }
} 