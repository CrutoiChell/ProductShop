import s from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../App/AuthSlice";
import { RootState } from "../../App/store";
import { useProfileQuery } from "../../App/apiSlice";
import { useState, ReactNode, JSX, useEffect } from "react";

export function Header(): JSX.Element {
  let token = useSelector((state: RootState) => state.auth.token);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let { data: profile, isLoading, error } = useProfileQuery(undefined, { 
    skip: !token 
  });
  let [menuOpen, setMenuOpen] = useState(false);
  let [scrolled, setScrolled] = useState(false);

  let handleClose = () => setMenuOpen(false);

  useEffect(() => {
    let handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) return <div className={`${s.header} ${scrolled ? s.scrolled : ''}`}><div className={s.loading}></div></div>;
  
  if (error) {
    console.log(error);
    return <div className={`${s.header} ${scrolled ? s.scrolled : ''}`}><p>Ошибка загрузки</p></div>;
  }

  let renderAuthLinks = (): ReactNode => {
    if (!token) {
      return (
        <div className={s.authBlock}>
          <Link to={'/sign-up'} className={s.link} onClick={handleClose}>Регистрация</Link>
          <Link to={'/sign-in'} className={`${s.link} ${s.cta}`} onClick={handleClose}>Войти</Link>
        </div>
      );
    }

    if (profile?.role === 'admin') {
      return (
        <div className={s.authBlock}>
          <Link to={'/admin/users'} className={s.link} onClick={handleClose}>
            <span className={s.icon}>👑</span>Пользователи
          </Link>
          <Link to={'/admin/orders'} className={s.link} onClick={handleClose}>
            <span className={s.icon}>📦</span>Заказы
          </Link>
          <Link to={'/admin/create-product'} className={s.link} onClick={handleClose}>
            <span className={s.icon}>✨</span>Создать
          </Link>
          <button 
            className={s.logout} 
            onClick={() => { 
              dispatch(logout()); 
              handleClose(); 
            }}
          >
            <span className={s.icon}>🚀</span>Выйти
          </button>
        </div>
      );
    }

    return (
      <div className={s.authBlock}>
        <Link to={'/profile'} className={s.link} onClick={handleClose}>
          <span className={s.icon}>👤</span>Профиль
        </Link>
        <Link to={'/cart'} className={s.link} onClick={handleClose}>
          <span className={s.icon}>🛒</span>Корзина
        </Link>
        <Link to={'/fav'} className={s.link} onClick={handleClose}>
          <span className={s.icon}>⭐</span>Избранное
        </Link>
        <button 
          className={s.logout} 
          onClick={() => { 
            dispatch(logout()); 
            navigate('/'); 
            handleClose(); 
          }}
        >
          <span className={s.icon}>🚪</span>Выйти
        </button>
      </div>
    );
  };

  return (
    <header className={`${s.header} ${scrolled ? s.scrolled : ''}`}>
      <div className={s.cosmicBorder}></div>
      
      <div className={s.logo}>
        <Link to="/">
          <span className={s.gradient}>Astro</span>
          <span className={s.neon}>Market</span>
        </Link>
        <div className={s.stars}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={s.star}></div>
          ))}
        </div>
      </div>

      <div 
        className={`${s.burger} ${menuOpen ? s.active : ''}`} 
        onClick={() => setMenuOpen(prev => !prev)}
        aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`${s.nav} ${menuOpen ? s.active : ''}`}>
        <Link to={'/catalog'} className={s.link} onClick={handleClose}>
          <span className={s.icon}>🔭</span>Каталог
        </Link>
        {renderAuthLinks()}
      </nav>
    </header>
  );
}