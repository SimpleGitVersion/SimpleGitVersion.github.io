module CSemVerPlayground.Website.VersionYourMind {
    export class SuccessorInput<T> {
        public expectedValue: T;
        public inputValue: T;
        public cheated: boolean;

        public get isValid() {
            return this.expectedValue == this.inputValue && !this.cheated;
        }

        public cheat() {
            this.inputValue = this.expectedValue;
            this.cheated = true;
        }

        public solve() {
            if (this.inputValue != this.expectedValue) {
                this.cheat();
            }
        }
    }
}