import Plus from "./plus"

export type AffinumOverlayProps = {
    className?: string
    style?: React.CSSProperties
}

const AffinumOverlay: React.FC<AffinumOverlayProps> = ({ className, style }) => (
    <div
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: `12px 12px 32px`,
            pointerEvents: "none",
            display: "grid",
            gridTemplateColumns: `auto 1fr auto`,
            gridTemplateRows: `auto 1fr auto`,
        }}
    >
        <Plus
            style={{
                gridColumnStart: 1,
                gridRowStart: 1,
            }}
        />
        <Plus
            style={{
                gridColumnStart: 3,
                gridRowStart: 1,
            }}
        />
        <Plus
            style={{
                gridColumnStart: 1,
                gridRowStart: 3,
            }}
        />
        <Plus
            style={{
                gridColumnStart: 3,
                gridRowStart: 3,
            }}
        />
    </div>
)

export default AffinumOverlay
