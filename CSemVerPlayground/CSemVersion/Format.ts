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

        /// The file version (see https://msdn.microsoft.com/en-us/library/system.diagnostics.fileversioninfo.fileversion.aspx)
        /// uses the whole 64 bits: it is the <see cref="ReleaseTagVersion.OrderedVersion"/> left shifted by 1 bit with 
        /// the less significant bit set to 0 for release and 1 CI builds.
        FileVersion,

        // NuGet version 2. If the <see cref="CSemVersion.IsMarkedInvalid"/> the "+invalid" build meta data is added.
        NugetPackageV2,

        // NuGet format. Currently <see cref="NugetPackageV2"/>.
        NuGetPackage = NugetPackageV2,

        // Default is <see cref="SemVerWithMarker"/>.
        Default = Normalized
    }
} 