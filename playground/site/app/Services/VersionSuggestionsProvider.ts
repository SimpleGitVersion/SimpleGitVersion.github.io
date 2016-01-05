module CSemVerPlayground.Website.Services {

    export interface IVersionSuggestionsProvider {
        getSuggestions(input: string): Array<string>;
    }

    export class VersionSuggestionsProvider implements IVersionSuggestionsProvider {
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
    }
} 