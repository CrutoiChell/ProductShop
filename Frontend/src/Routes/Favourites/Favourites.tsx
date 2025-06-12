import { useFavQuery } from "../../App/apiSlice"
import { Card } from "../../Components/Card/Card"
import s from "./Favourites.module.scss"
import { useEffect, useState } from "react"

export function Favourites() {
  let { data: fav, isLoading, error } = useFavQuery()
  let [activeStars, setActiveStars] = useState(0)

  useEffect(() => {
    let interval = setInterval(() => {
      setActiveStars(prev => (prev + 1) % 3)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  if (isLoading) return (
    <div className={s.loading}>
      <div className={s.loader}></div>
      <p>Загрузка избранного...</p>
    </div>
  )

  if (error) return (
    <div className={s.error}>
      <div className={s.errorIcon}>⚠️</div>
      <p>Ошибка загрузки избранного!</p>
      <p>Попробуйте перезагрузить страницу</p>
    </div>
  )

  if (fav?.length === 0) {
    return (
      <div className={s.emptyFavourites}>
        <div className={s.stars}>
          {[...Array(30)].map((_, i) => (
            <div key={i} className={s.star}></div>
          ))}
        </div>
        
        <div className={s.planet}></div>
        <div className={s.asteroid}></div>
        
        <div className={s.emptyContent}>
          <div className={s.emptyIcon}>⭐</div>
          <h1 className={s.emptyTitle}>Космическое избранное пусто</h1>
          <p className={s.emptyText}>Добавляйте понравившиеся товары, чтобы они всегда были под рукой</p>
          <button onClick={() => window.location.href = '/catalog'} className={s.catalogButton}>
            Перейти в каталог
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className={s.favouritesSection}>
      <div className={s.stars}>
        {[...Array(30)].map((_, i) => (
          <div key={i} className={s.star}></div>
        ))}
      </div>
      
      <div className={s.planet}></div>
      <div className={s.asteroid}></div>
      
      <h1 className={s.sectionTitle}>Избранные товары</h1>
      <p className={s.sectionSubtitle}>Ваши космические предпочтения</p>
      
      <div className={s.favouritesGrid}>
        {fav?.map((item) => (
          <div 
            key={item.id} 
            className={s.cardWrapper}
            data-star-animation={activeStars === item.id % 3 ? "active" : ""}
          >
            <Card
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
          </div>
        ))}
      </div>
    </section>
  )
}