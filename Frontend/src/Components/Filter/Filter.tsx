import s from "./Filter.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../App/store"
import { toggleFilter } from "../../App/productFilterSlice"
import { IFilterItem } from "../../types"

export function Filter() {

    let select = useSelector((state: RootState) => state.productfilter)
    let disp = useDispatch()

    function onFilterChange(item: IFilterItem, field: "filtres" | "others") {
        console.log(item);

        let updated = select.filtres.map(el => {
            if (el.id === item.id) {
                return { ...el, checked: !el.checked }
            }
            return el
        })
        disp(toggleFilter({ updated, field }))
    }

    return (
        <div className={s.filterContainer}>
            <div className={s.filterItems}>
                {
                    select.filtres.map((item, id) => {
                        return (
                            <div key={id} className={s.filterItem}>
                                <input
                                    type="checkbox"
                                    id={item.id}
                                    checked={item.checked}
                                    onChange={() => onFilterChange(item, 'filtres')}
                                    className={s.filterCheckbox}
                                />
                                <label htmlFor={item.id} className={s.filterLabel}>{item.name}</label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};
