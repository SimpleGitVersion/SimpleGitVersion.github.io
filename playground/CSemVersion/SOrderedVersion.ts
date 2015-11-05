module CSemVerPlayground.CSemVersion {
    export class SOrderedVersion {
        private number: BigJsLibrary.BigJS;
        private major: number;
        private minor: number;
        private build: number;
        private revision: number;

        constructor(n: BigJsLibrary.BigJS) {
            this.Number = n;
        }

        public get Number(): BigJsLibrary.BigJS {
            return this.number;
        }

        public set Number(n: BigJsLibrary.BigJS) {
            this.number = n;

            if (this.number != null) {
                this.revision = parseInt(this.number.mod(65536).toFixed());

                var rest = this.number.minus(this.revision).div(65536);
                this.build = parseInt(rest.mod(65536).toFixed());

                rest = rest.minus(this.build).div(65536);
                this.minor = parseInt(rest.mod(65536).toFixed());

                rest = rest.minus(this.minor).div(65536);
                this.major = parseInt(rest.mod(65536).toFixed());
            }
        }

        public get Major(): number {
            return this.major;
        }

        public get Minor(): number {
            return this.minor;
        }

        public get Build(): number {
            return this.build;
        }

        public get Revision(): number {
            return this.revision;
        }
    }
} 