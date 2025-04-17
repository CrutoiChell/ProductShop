import { Link } from "react-router-dom"
import { useGetAllUsersQuery } from "../../App/apiSlice"
import s from "./Users.module.scss"

export function Users() {

  let { data: profiles, isLoading, error } = useGetAllUsersQuery()

  if (isLoading) return <div className={s.loading}>Загрузка...</div>

  if (error) return <div className={s.error}>Ошибка загрузки профиля!</div>

  return (
    <section className={s.userList}>
      {
        profiles?.map((item) => {
          return (
            <div className={s.userCard} key={item.id}>
              <div className={s.userInfo}>
                <h3 className={s.userTitle}>Пользователь №{item.id || 'нет данных'}</h3>
                <div className={s.userField}>Имя: {item.name || 'нет данных'}</div>
                <div className={s.userField}>Фамилия: {item.surname || 'нет данных'}</div>
                <div className={s.userField}>Почта: {item.email || 'нет данных'}</div>
                <div className={s.userField}>Номер телефона: {item.phone_number || 'нет данных'}</div>
                <div className={s.userField}>Адрес: {item.address || 'нет данных'}</div>
                <div className={s.userField}>Роль: {item.role || 'нет данных'}</div>
              </div>
              <div className={s.linkWrapper}>
                <Link className={s.detailsLink} to={`/admin/users/${item.id}`}>Подробнее</Link>
              </div>
            </div>
          )
        })
      }
    </section>
  )
};
