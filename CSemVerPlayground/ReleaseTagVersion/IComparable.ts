module CSemVerPlayground.ReleaseTagVersion {
    export interface IComparable<T> {
        compareTo(other: T): number;
    }
}  