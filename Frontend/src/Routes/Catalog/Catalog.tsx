import { Cards } from "../../Components/Cards/Cards"
import { Filter } from "../../Components/Filter/Filter"
import s from "./Catalog.module.scss"

export function Catalog() {
    return (
        <section className={s.catalogContainer}>
            <div className={s.filterSection}>
                <Filter />
            </div>
            <div className={s.cardsSection}>
                <h2 className={s.catalogTitle}>Каталог</h2>
                <Cards />
            </div>
        </section>
    )
};
