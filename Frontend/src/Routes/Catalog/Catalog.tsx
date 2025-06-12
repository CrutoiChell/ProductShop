import { Cards } from "../../Components/Cards/Cards";
import { Filter } from "../../Components/Filter/Filter";
import s from "./Catalog.module.scss";
import { useState, useEffect } from "react";

export function Catalog() {
  let [activePlanet, setActivePlanet] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setActivePlanet(prev => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={s.catalogSection}>
      <div className={s.stars}>
        {[...Array(50)].map((_, i) => (
          <div key={i} className={s.star}></div>
        ))}
      </div>
      
      <div className={s.planets}>
        <div className={`${s.planet} ${activePlanet === 0 ? s.active : ''}`}></div>
        <div className={`${s.planet} ${activePlanet === 1 ? s.active : ''}`}></div>
        <div className={`${s.planet} ${activePlanet === 2 ? s.active : ''}`}></div>
      </div>
      
      <div className={s.catalogContainer}>
        <div className={s.filterSection}>
          <Filter />
        </div>
        
        <div className={s.cardsSection}>
          <div className={s.header}>
            <h1 className={s.catalogTitle}>Космический каталог</h1>
            <p className={s.catalogSubtitle}>Исследуйте наши галактические товары</p>
          </div>
          <Cards />
        </div>
      </div>
    </section>
  );
}