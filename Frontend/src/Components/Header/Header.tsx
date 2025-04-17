import s from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../App/AuthSlice";
import { RootState } from "../../App/store";
import { useProfileQuery } from "../../App/apiSlice";
import { useState } from "react";

export function Header() {
  let select = useSelector((state: RootState) => state.auth.token);
  let disp = useDispatch();
  let nav = useNavigate();
  let { data: profile, isLoading, error } = useProfileQuery(undefined, { skip: !select });
  let [menuOpen, setMenuOpen] = useState(false);

  let handleClose = () => setMenuOpen(false);

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return console.log(error);

  let renderLinks = (
    <>
      <Link to={'/catalog'} className={s.link} onClick={handleClose}>Каталог</Link>
      {profile?.role === 'admin' ? (
        select ? (
          <div className={s.authBlock}>
            <Link to={'/admin/users'} className={s.link} onClick={handleClose}>Пользователи</Link>
            <Link to={'/admin/orders'} className={s.link} onClick={handleClose}>Заказы</Link>
            <Link to={'/admin/create-product'} className={s.link} onClick={handleClose}>Создать товар</Link>
            <button className={s.logout} onClick={() => { disp(logout()); handleClose(); }}>выйти</button>
          </div>
        ) : (
          <div className={s.authBlock}>
            <Link to={'/sign-up'} className={s.link} onClick={handleClose}>Регистрация</Link>
            <Link to={'/sign-in'} className={s.link} onClick={handleClose}>Войти</Link>
          </div>
        )
      ) : (
        select ? (
          <div className={s.authBlock}>
            <button className={s.logout} onClick={() => { disp(logout()); nav('/'); handleClose(); }}>выйти</button>
            <Link to={'/profile'} className={s.link} onClick={handleClose}>Профиль</Link>
            <Link to={'/cart'} className={s.link} onClick={handleClose}>Корзина</Link>
            <Link to={'/fav'} className={s.link} onClick={handleClose}>Избранное</Link>
          </div>
        ) : (
          <div className={s.authBlock}>
            <Link to={'/sign-up'} className={s.link} onClick={handleClose}>Регистрация</Link>
            <Link to={'/sign-in'} className={s.link} onClick={handleClose}>Войти</Link>
          </div>
        )
      )}
    </>
  );

  return (
    <header className={s.header}>
      <div className={s.logo}>
        <Link to="/">Astro<br />Market</Link>
      </div>

      <div className={`${s.burger} ${menuOpen ? s.active : ''}`} onClick={() => setMenuOpen(prev => !prev)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`${s.nav} ${menuOpen ? s.active : ''}`}>
        {renderLinks}
      </nav>
    </header>
  );
}
