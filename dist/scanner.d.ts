import { ErrorReporter } from "./debugger";
import { Token } from "./types";
export interface Scanner {
    scan(): Array<Token>;
    synchronize(): void;
}
export declare function createScanner(src: string, report?: ErrorReporter): {
    scan: () => Array<Token>;
    synchronize: () => void;
};
