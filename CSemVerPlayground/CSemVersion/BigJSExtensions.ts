module BigJsLibrary {
    export class Extensions {
        public static leftShift(nbr: BigJsLibrary.BigJS, shift: number) {
            return nbr.times(Math.pow(2, shift));
        }

        public static rightShift(nbr: BigJsLibrary.BigJS, shift: number) {
            return nbr.div(Math.pow(2, shift));
        }
    }
}