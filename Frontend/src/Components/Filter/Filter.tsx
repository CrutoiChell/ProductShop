import s from "./Filter.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../App/store";
import { toggleFilter } from "../../App/productFilterSlice";
import { IFilterItem } from "../../types";

export function Filter() {
  let select = useSelector((state: RootState) => state.productfilter);
  let disp = useDispatch();

  function onFilterChange(item: IFilterItem, field: "filtres" | "others") {
    let updated = select.filtres.map(el => {
      if (el.id === item.id) {
        return { ...el, checked: !el.checked };
      }
      return el;
    });
    disp(toggleFilter({ updated, field }));
  }

  return (
    <div className={s.filterContainer}>
      <div className={s.filterHeader}>
        <h3 className={s.filterTitle}>Космические фильтры</h3>
        <div className={s.filterIcon}>🔭</div>
      </div>
      
      <div className={s.filterItems}>
        {select.filtres.map((item) => (
          <div key={item.id} className={s.filterItem}>
            <label className={s.filterLabel}>
              <input
                type="checkbox"
                id={item.id}
                checked={item.checked}
                onChange={() => onFilterChange(item, 'filtres')}
                className={s.filterCheckbox}
              />
              <span className={s.customCheckbox}></span>
              <span className={s.filterName}>{item.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}