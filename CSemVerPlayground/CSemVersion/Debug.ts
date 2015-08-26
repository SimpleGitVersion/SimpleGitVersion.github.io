module CSemVerPlayground.CSemVersion {
    export class Debug {
        public static assert(condition: boolean, error?: string): void {
            if (!condition) {
                throw new Error(error);
            }
        }
    }
} 