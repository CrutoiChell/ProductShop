import { useFavQuery } from "../../App/apiSlice"
import { Card } from "../../Components/Card/Card"
import s from "./Favourites.module.scss"

export function Favourites() {

  let { data: fav, isLoading, error } = useFavQuery()

  if (isLoading) return <div className={s.loading}>Загрузка...</div>

  if (error) return <div className={s.error}>Ошибка загрузки профиля!</div>

  if (fav?.length === 0) {
    return <h1 className={s.emptyMessage}>Вы похоже ничего не купили</h1>
  }

  return (
    <section className={s.favouritesSection}>
      {fav?.map((item) => (
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
      ))}
    </section>
  )
};
