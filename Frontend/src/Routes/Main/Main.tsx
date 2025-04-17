import { Link } from "react-router-dom";
import s from "./Main.module.scss";

export function Main() {
  return (
    <main className={s.main}>
      <div className={s.hero}>
        <h1 className={s.title}>Добро пожаловать в Astromarket</h1>
        <p className={s.subtitle}>Исследуй космос — начни с покупки</p>
        <Link to={'/catalog'} className={s.cta}>Перейти к товарам</Link>
      </div>
    </main>
  );
}
