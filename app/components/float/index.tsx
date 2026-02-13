import { useCallback, useEffect } from "react"
import useResizeHandler, { type ResizeTransform } from "~/hooks/use-resize-handler"
import styles from "./styles.css"

function cssPercent(value: number): string {
    return `${value * 100}%`
}

function clamp(value: number, min: number, max: number) {
    if (value < min) {
        return min
    }
    if (value > max) {
        return max
    }
    return value
}

export const links = () => [{ rel: "stylesheet", href: styles }]

export type FloatProps = {
    value: number
    children: React.ReactNode
    onChange?: (width: number, absoluteWidth: number) => void
}

export const Float: React.FC<FloatProps> = ({ value, children, onChange }) => {
    const transform = useCallback<ResizeTransform>((value) => clamp(value, 0.1, 0.9), [])
    const { ref, width, absoluteWidth } = useResizeHandler(value, transform)

    useEffect(() => {
        if (typeof onChange === "function") {
            onChange(width, absoluteWidth)
        }
    }, [width, absoluteWidth, onChange])

    return (
        <div
            className="float"
            style={{
                width: cssPercent(width),
            }}
        >
            <div className="float-content">{children}</div>
            <div className="float-control" ref={ref} />
        </div>
    )
}
