module CSemVerPlayground.CSemVersion {
    export class String {
        public static isNullOrWhiteSpace(str: string) {
            if (str == null) return true;

            str = str.trim();
            
            return str.length == 0;
        }

        public static fillWith(str: string, fillChar: string, lengthNeeded: number) {
            var nbrOfCharToAdd = lengthNeeded - str.length;

            if (nbrOfCharToAdd <= 0) return str;

            for (var i = 0; i < nbrOfCharToAdd; i++) {
                str = fillChar.concat(str);
            }

            return str;
        }
    }
}