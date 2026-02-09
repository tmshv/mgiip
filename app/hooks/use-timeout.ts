import { useEffect } from "react"

export function useTimeout(callback: () => void, ms: number) {
    useEffect(() => {
        const id = setTimeout(callback, ms)
        return () => {
            clearTimeout(id)
        }
    }, [callback, ms])
}
