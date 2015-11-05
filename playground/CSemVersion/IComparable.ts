module CSemVerPlayground.CSemVersion {
    export interface IComparable<T> {
        compareTo(other: T): number;
    }
}  