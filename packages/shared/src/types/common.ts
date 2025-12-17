// Generic type to replace explicit 'any' usage where strict typing is impractical
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyData = any;

export interface ApiResponse<T = AnyData> {
    message: string;
    data?: T;
    errors?: AnyData[];
}
