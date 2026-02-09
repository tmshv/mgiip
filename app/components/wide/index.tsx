import styles from "./styles.css"

export const links = () => [{ rel: "stylesheet", href: styles }]

export type WideProps = {
    children: React.ReactNode
    ar?: React.CSSProperties["aspectRatio"]
}

const Wide: React.FC<WideProps> = ({ children, ar }) => {
    return (
        <section
            className="wide"
            style={{
                aspectRatio: ar,
            }}
        >
            <div className="wide-content">{children}</div>
        </section>
    )
}

export default Wide
