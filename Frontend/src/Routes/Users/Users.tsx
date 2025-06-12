import { Link } from "react-router-dom";
import { useGetAllUsersQuery } from "../../App/apiSlice";
import s from "./Users.module.scss";
import { useState, useEffect } from "react";

export function Users() {
  let { data: profiles, isLoading, error } = useGetAllUsersQuery();
  let [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let stars = document.querySelectorAll(`.${s.star}`);
    stars.forEach(star => {
      let el = star as HTMLElement;
      let size = Math.random() * 3;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.animationDelay = `${Math.random() * 5}s`;
    });
  }, []);

  if (isLoading) return (
    <div className={s.loading}>
      <div className={s.loader}></div>
      <p>Загрузка космических данных...</p>
    </div>
  );

  if (error) return (
    <div className={s.error}>
      <div className={s.errorIcon}>⚠️</div>
      <p>Ошибка загрузки профилей!</p>
      <p>Попробуйте перезагрузить страницу</p>
    </div>
  );

  return (
    <section className={s.usersSection}>
      <div className={s.stars}>
        {[...Array(50)].map((_, i) => (
          <div key={i} className={s.star}></div>
        ))}
      </div>

      <div className={s.planet}></div>
      <div className={s.asteroid}></div>

      <h1 className={s.sectionTitle}>Космические пользователи</h1>
      <p className={s.sectionSubtitle}>Управление галактической базой пользователей</p>

      <div className={s.userList}>
        {profiles?.map((item, index) => (
          <div
            className={`${s.userCard} ${activeIndex === index ? s.active : ''}`}
            key={item.id}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(-1)}
          >
            <div className={s.userHeader}>
              <div className={s.userAvatar}>
                {item.name?.charAt(0) || 'U'}
              </div>
              <div className={s.userTitleWrapper}>
                <h3 className={s.userTitle}>ID: {item.id || 'N/A'}</h3>
                <div className={`${s.userRole} ${item.role === 'admin' ? s.admin : s.user}`}>
                  {item.role === 'admin' ? 'Админ' : 'Пользователь'}
                </div>
              </div>
            </div>

            <div className={s.userInfo}>
              <div className={s.userField}>
                <span className={s.fieldLabel}>Имя:</span>
                <span className={s.fieldValue}>{item.name || 'Не указано'}</span>
              </div>
              <div className={s.userField}>
                <span className={s.fieldLabel}>Фамилия:</span>
                <span className={s.fieldValue}>{item.surname || 'Не указана'}</span>
              </div>
              <div className={s.userField}>
                <span className={s.fieldLabel}>Почта:</span>
                <span className={s.fieldValue}>{item.email || 'Не указана'}</span>
              </div>
              <div className={s.userField}>
                <span className={s.fieldLabel}>Телефон:</span>
                <span className={s.fieldValue}>{item.phone_number || 'Не указан'}</span>
              </div>
              <div className={s.userField}>
                <span className={s.fieldLabel}>Адрес:</span>
                <span className={s.fieldValue}>{item.address || 'Не указан'}</span>
              </div>
            </div>

            <div className={s.linkWrapper}>
              <Link className={s.detailsLink} to={`/admin/users/${item.id}`}>
                <span>Подробнее</span>
                <span className={s.linkIcon}>🚀</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}