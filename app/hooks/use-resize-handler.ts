import { useCallback, useEffect, useRef, useState } from "react"

export type ResizeTransform = (width: number) => number

export default function useResizeHandler(startWidth: number, transform: ResizeTransform) {
    const ref = useRef<HTMLDivElement>(null)
    const refx = useRef<number>(0)
    const [width, setWidth] = useState({
        width: startWidth,
        absoluteWidth: startWidth * window.innerWidth,
    })

    const up = useCallback(() => {
        refx.current = 0
    }, [])

    useEffect(() => {
        const down = (event: MouseEvent) => {
            event.preventDefault()
            refx.current = event.pageX
        }

        const move = (event: MouseEvent) => {
            if (!refx.current) {
                return
            }
            // take right part and translate to %
            const containerWidth = window.innerWidth
            const x = event.pageX
            const w = containerWidth - x
            const r = w / containerWidth
            const width = transform(r)
            setWidth({
                width,
                absoluteWidth: width * w,
            })
        }

        const el = ref.current
        if (!el) return

        el.addEventListener("mousedown", down)
        document.addEventListener("mouseup", up, true)
        document.addEventListener("mousemove", move, true)

        return () => {
            el.removeEventListener("mousedown", down)
            document.removeEventListener("mouseup", up, true)
            document.removeEventListener("mousemove", move, true)
        }
    }, [transform, up])

    return {
        ref,
        width: width.width,
        absoluteWidth: width.absoluteWidth,
    }
}
