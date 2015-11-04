module CSemVerPlayground.CSemVersion {
    export class CIBuildDescriptor {
        public static get maxNuGetV2BuildIndex() { return 9999; }

        private _buildIndex: number;

        public get buildIndex() {
            return this._buildIndex;
        }

        public set buildIndex(idx: number) {
            if (idx < 0) throw new Error("ArgumentException");
            this._buildIndex = idx;
        }

        public branchName: string;

        public get isValid() {
            return this._buildIndex >= 0 && !String.isNullOrWhiteSpace(this.branchName);
        }

        public get isValidForNuGetV2() {
            return this.isValid && this._buildIndex <= CIBuildDescriptor.maxNuGetV2BuildIndex && this.branchName.length <= 8;
        }

        public toString() {
            return this.isValid ? `ci-${this.branchName}.${this.buildIndex}` : "";
        }

        public toStringForNuGetV2() {
            return this.isValid ? `${this.branchName}-${String.fillWith(this.buildIndex.toString(), "0", 4) }` : "";
        }
    }
}