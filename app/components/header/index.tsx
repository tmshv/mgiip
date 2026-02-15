import { Logo } from "~/components/affinum-logo"
import SearchOverlay from "~/components/search-overlay"
import type { FieldKeys } from "~/types/fields"

export type HeaderProps = {
    fields: FieldKeys
    datasetCount: number
    onSearchSelect: (coordinate: [number, number], zoom: number) => void
}

export default function Header({ fields, datasetCount, onSearchSelect }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-brand">
                <Logo width={166} height={10} fill="white" />
                <h1 className="header-title header-title--full">Статистика конкурса МГиИП 2018-2025</h1>
                <h1 className="header-title header-title--short">МГиИП</h1>
            </div>
            <div style={{ flex: 1 }} />
            <SearchOverlay fields={fields} datasetCount={datasetCount} onSelect={onSearchSelect} />
        </header>
    )
}
