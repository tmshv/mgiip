export type PlusProps = {
    className?: string
    style?: React.CSSProperties
    color?: string
    size?: number
}

const Plus: React.FC<PlusProps> = ({ className, style, size = 24, color = "#000000" }) => (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <path id="Line" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M -0 12 L 24 12" />
        <path id="Line-copy" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M 12 24 L 12 0" />
    </svg>
)

export default Plus
