import { useOrdersQuery, useProfileQuery } from "../../App/apiSlice";
import { Link } from "react-router-dom";
import s from "./Profile.module.scss";

export function Profile() {
  let { data: profile, isLoading, error } = useProfileQuery();
  let { data: orders } = useOrdersQuery();

  if (isLoading) return <p>Загрузка...</p>;

  if (error) return <p>Ошибка загрузки профиля!</p>;

  return (
    <section className={s.profileSection}>
      <div className={s.profileContainer}>
        <h1 className={s.profileTitle}>Профиль</h1>
        <div className={s.profileDetails}>
          <p className={s.profileItem}><strong>Имя:</strong> {profile?.name}</p>
          <p className={s.profileItem}><strong>Фамилия:</strong> {profile?.surname}</p>
          <p className={s.profileItem}><strong>Адрес:</strong> {profile?.address}</p>
          <p className={s.profileItem}><strong>Email:</strong> {profile?.email}</p>
          <p className={s.profileItem}><strong>Телефон:</strong> {profile?.phone_number}</p>
        </div>
      </div>

      <div className={s.ordersContainer}>
        <h2 className={s.ordersTitle}>Заказы</h2>
        <div className={s.ordersList}>
          {orders?.length === 0 ? (
            <h3>Заказов нет</h3>
          ) : (
            orders?.map((order) => (
              <div key={order.id} className={s.orderItem}>
                <p>Заказ: №{order.id}</p>
                <Link to={`/orders/${order.id}`} className={s.orderLink}>Подробнее</Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
