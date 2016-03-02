module CSemVerPlayground.Website.Services {

    export interface IVersionHelper {
        getSuggestions(input: string): Array<string>;

        getReleaseKind(v: CSemVersion.CSemVersion): string;
        getReleaseKindColor(v: CSemVersion.CSemVersion): string;

        getReleaseSubKind(v: CSemVersion.CSemVersion): string;
        getReleaseSubKindColor(v: CSemVersion.CSemVersion): string;

        getNormalizedVersion(v: CSemVersion.CSemVersion): string;
        getNugetVersion(v: CSemVersion.CSemVersion): string;
        getFileVersion(v: CSemVersion.CSemVersion): string;
    }

    export class VersionHelper implements IVersionHelper {
        constructor() {

        }

        public getSuggestions(input: string): Array<string> {
            if (input && input.indexOf("-") > -1) {
                var leftPart = input.split("-")[0];

                return CSemVersion.CSemVersion.standardPreReleaseNames.map(function (val) {
                    return leftPart + "-" + val;
                });
            }

            return [];
        }

        public getReleaseKind(v: CSemVersion.CSemVersion): string {
            return v.kind == CSemVersion.ReleaseTagKind.OfficialRelease ? "Official Release" : "PreRelease";
        }

        public getReleaseKindColor(v: CSemVersion.CSemVersion): string {
            if (v.kind == CSemVersion.ReleaseTagKind.OfficialRelease) return "label-success";
            else return "label-primary";
        }

        public getReleaseSubKind(v: CSemVersion.CSemVersion): string {
            if (v.kind == CSemVersion.ReleaseTagKind.OfficialRelease) {
                if (v.minor == 0 && v.patch == 0) return "Major";
                else if (v.patch == 0) return "Minor";
                else return "Patch";
            }
            else {
                if (v.preReleaseNumber == 0 && v.preReleaseFix == 0) return "Main";
                else if (v.preReleaseFix == 0) return "Numbered";
                else return "Patch";
            }
        }

        public getReleaseSubKindColor(v: CSemVersion.CSemVersion): string {
            var kind = this.getReleaseSubKind(v);

            if (kind == "Major" || kind == "Main") return "label-info";
            else if (kind == "Minor" || kind == "Numbered") return "label-info";
            else return "label-default";
        }

        public getNormalizedVersion(v: CSemVersion.CSemVersion): string {
            return v.toString(CSemVersion.Format.Normalized);
        }

        public getNugetVersion(v: CSemVersion.CSemVersion): string {
            return v.toString(CSemVersion.Format.NugetPackageV2);
        }

        public getFileVersion(v: CSemVersion.CSemVersion): string {
            return v.toString(CSemVersion.Format.FileVersion);
        }
    }
} 