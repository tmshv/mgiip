import { Logo, LogoPlus } from "~/components/affinum-logo"

export default function Header() {
    return (
        <header className="header">
            <Logo width={166} height={10} fill="black" />
            <h1 className="header-title">Статистика конкурса МГиИП 2018-2025</h1>
            <div style={{ flex: 1 }} />
            <LogoPlus width={8} height={8} fill="black" />
        </header>
    )
}
