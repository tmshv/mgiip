import { useTimeout } from "./use-timeout"

export function useNextTick(callback: () => void) {
    useTimeout(callback, 0)
}
