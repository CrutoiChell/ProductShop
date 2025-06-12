import s from "./Cards.module.scss";
import { useProductsQuery } from "../../App/apiSlice";
import { Card } from "../Card/Card";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store";

export function Cards() {
  let select = useSelector((state: RootState) => state.productfilter.filtres);

  let { data: products, isLoading, error } = useProductsQuery();

  if (isLoading) return <div className={s.loading}>Загрузка...</div>;

  if (error) return <div className={s.error}>Ошибка загрузки!</div>;

  let selectedCategories = select
    .filter((item) => item.checked)
    .map((item) => item.name);

  let result = products?.filter((item) => {
    if (selectedCategories.length === 0) return true;
    return selectedCategories.includes(item.category);
  });

  if (result?.length === 0) {
    return <div className={s.noResults}>По выбранным фильтрам ничего не найдено 😔</div>;
  }

  return (
    <div className={s.cardsContainer}>
      {(result?.length === 0 ? products : result)?.map((item) => {
        return (
          <Card
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            img_url={item.img_url}
            price={item.price}
            count={item.count}
            category={item.category}
            brand={item.brand}
            discount={item.discount}
            composition={item.composition}
          />
        );
      })}
    </div>
  );
}
