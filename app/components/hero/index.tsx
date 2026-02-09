import styles from "./styles.css"

export const links = () => [{ rel: "stylesheet", href: styles }]

export type HeroProps = {
    children: React.ReactNode
    area?: string
    budget?: string
    color?: string
}

const Hero: React.FC<HeroProps> = ({ children, area, budget, color = "black" }) => {
    return (
        <section
            className="hero"
            style={{
                marginBottom: 64,
                color,
            }}
        >
            <div className="caption">{children}</div>

            <div className="values">
                <div className="number">
                    <div className="value">{area}</div>
                    площадь территории
                </div>

                <div className="number">
                    <div className="value">{budget}</div>
                    бюджет проекта
                </div>
            </div>
        </section>
    )
}

export default Hero
