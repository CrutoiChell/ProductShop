import { useEditProfileMutation, useOrdersQuery, useProfileQuery } from "../../App/apiSlice";
import { Link } from "react-router-dom";
import s from "./Profile.module.scss";
import { useState, useEffect } from "react";

export function Profile() {
  let { data: profile, isLoading, error, refetch } = useProfileQuery();
  let { data: orders } = useOrdersQuery();
  let [activePlanet, setActivePlanet] = useState(0);
  let [IsEdit, setIsEdit] = useState(false);
  let [userData, setUserData] = useState({
    name: '',
    surname: '',
    address: '',
    email: '',
    phone_number: '',
    password: '',
    passwordConfirm: ''
  });
  let [editProfile, { isLoading: isSaving }] = useEditProfileMutation();

  useEffect(() => {
    let interval = setInterval(() => {
      setActivePlanet(prev => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (profile) {
      setUserData({
        name: profile.name || '',
        surname: profile.surname || '',
        address: profile.address || '',
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        password: '',
        passwordConfirm: ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!userData.name.trim() || !userData.email.trim()) {
        alert("Заполните обязательные поля: Имя и Email");
        return;
      }

      if (userData.password && userData.password !== userData.passwordConfirm) {
        alert("Пароли не совпадают!");
        return;
      }

      const updatedData: any = {
        name: userData.name,
        email: userData.email,
      };

      if (userData.surname !== profile?.surname) updatedData.surname = userData.surname;
      if (userData.address !== profile?.address) updatedData.address = userData.address;
      if (userData.phone_number !== profile?.phone_number) updatedData.phone_number = userData.phone_number;

      if (userData.password) updatedData.password = userData.password;

      await editProfile(updatedData).unwrap();
      setIsEdit(false);

      setUserData(prev => ({ ...prev, password: '', passwordConfirm: '' }));
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      alert("Произошла ошибка при сохранении данных");
    }
  };

  if (isLoading) return (
    <div className={s.loading}>
      <div className={s.loader}></div>
      <p>Загрузка космических данных...</p>
    </div>
  );

  if (error) return (
    <div className={s.error}>
      <div className={s.errorIcon}>⚠️</div>
      <p>Ошибка загрузки профиля!</p>
      <p>Попробуйте перезагрузить страницу</p>
    </div>
  );

  return (
    <section className={s.profileSection}>
      <div className={s.stars}>
        {[...Array(50)].map((_, i) => (
          <div key={i} className={s.star}></div>
        ))}
      </div>

      {IsEdit ? (
        <div className={s.profileContainer}>
          <h1 className={s.profileTitle}>
            <span className={s.titleMain}>Редактирование профиля</span>
            <span className={s.titleSub}>AstroMarket ID: #{profile?.id}</span>
          </h1>

          <div className={s.profileDetails}>
            <div className={s.detailCard}>
              <div className={s.cardIcon}>👤</div>
              <div>
                <h3 className={s.cardTitle}>Личные данные</h3>
                <input
                  name="name"
                  className={s.editInput}
                  placeholder="Имя *"
                  value={userData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="surname"
                  className={s.editInput}
                  placeholder="Фамилия"
                  value={userData.surname}
                  onChange={handleInputChange}
                />
                <input
                  name="password"
                  type="password"
                  className={s.editInput}
                  placeholder="Новый пароль"
                  value={userData.password}
                  onChange={handleInputChange}
                />
                {userData.password && (
                  <input
                    name="passwordConfirm"
                    type="password"
                    className={s.editInput}
                    placeholder="Подтвердите пароль"
                    value={userData.passwordConfirm}
                    onChange={handleInputChange}
                  />
                )}
              </div>
            </div>

            <div className={s.detailCard}>
              <div className={s.cardIcon}>📍</div>
              <div>
                <h3 className={s.cardTitle}>Адрес доставки</h3>
                <input
                  name="address"
                  className={s.editInput}
                  placeholder="Адрес доставки"
                  value={userData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={s.detailCard}>
              <div className={s.cardIcon}>📱</div>
              <div>
                <h3 className={s.cardTitle}>Контактные данные</h3>
                <input
                  name="email"
                  type="email"
                  className={s.editInput}
                  placeholder="Email *"
                  value={userData.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  name="phone_number"
                  type="tel"
                  className={s.editInput}
                  placeholder="Телефон"
                  value={userData.phone_number}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className={s.editActions}>
            <button
              onClick={handleSubmit}
              className={s.saveButton}
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            <button
              onClick={() => {
                setIsEdit(false);
                if (profile) {
                  setUserData({
                    name: profile.name || '',
                    surname: profile.surname || '',
                    address: profile.address || '',
                    email: profile.email || '',
                    phone_number: profile.phone_number || '',
                    password: '',
                    passwordConfirm: ''
                  });
                }
              }}
              className={s.cancelButton}
            >
              Отменить
            </button>
          </div>
        </div>
      ) : (
        <div className={s.profileContainer}>
          <h1 className={s.profileTitle}>
            <span className={s.titleMain}>Космический профиль</span>
            <span className={s.titleSub}>AstroMarket ID: #{profile?.id}</span>
          </h1>

          <div className={s.profileDetails}>
            <div className={s.detailCard}>
              <div className={s.cardIcon}>👤</div>
              <div>
                <h3 className={s.cardTitle}>Личные данные</h3>
                <p className={s.profileItem}><span>Имя:</span> {profile?.name}</p>
                <p className={s.profileItem}><span>Фамилия:</span> {profile?.surname}</p>
                <p className={s.profileItem}><span>Пароль:</span> ********</p>
              </div>
            </div>

            <div className={s.detailCard}>
              <div className={s.cardIcon}>📍</div>
              <div>
                <h3 className={s.cardTitle}>Адрес доставки</h3>
                <p className={s.profileItem}>{profile?.address || 'Не указан'}</p>
              </div>
            </div>

            <div className={s.detailCard}>
              <div className={s.cardIcon}>📱</div>
              <div>
                <h3 className={s.cardTitle}>Контактные данные</h3>
                <p className={s.profileItem}><span>Email:</span> {profile?.email}</p>
                <p className={s.profileItem}><span>Телефон:</span> {profile?.phone_number || 'Не указан'}</p>
              </div>
            </div>
          </div>

          <div className={s.actions}>
            <button onClick={() => setIsEdit(true)} className={s.editButton}>
              Редактировать профиль
            </button>
          </div>
        </div>
      )}

      <div className={s.planets}>
        <div className={`${s.planet} ${activePlanet === 0 ? s.active : ''}`}></div>
        <div className={`${s.planet} ${activePlanet === 1 ? s.active : ''}`}></div>
        <div className={`${s.planet} ${activePlanet === 2 ? s.active : ''}`}></div>
      </div>

      <div className={s.ordersContainer}>
        <h2 className={s.ordersTitle}>
          <span className={s.titleMain}>История заказов</span>
          <span className={s.titleSub}>Ваши космические покупки</span>
        </h2>

        <div className={s.ordersList}>
          {orders?.length === 0 ? (
            <div className={s.noOrders}>
              <div className={s.noOrdersIcon}>🌌</div>
              <h3>Заказов еще нет</h3>
              <p>Отправляйтесь за покупками в наш космический каталог</p>
              <Link to="/catalog" className={s.catalogLink}>Перейти в каталог</Link>
            </div>
          ) : (
            orders?.map((order) => (
              <div key={order.id} className={s.orderItem}>
                <div className={s.orderInfo}>
                  <div className={s.orderId}>Заказ #{order.id}</div>
                  <div className={s.orderDate}>
                    {new Date(order.created_at).toLocaleDateString("ru-RU", {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className={s.orderStatus}>
                    <span className={s.statusLabel}>Статус:</span>
                    <span className={s.statusValue}>{order.status}</span>
                  </div>
                </div>
                <Link to={`/orders/${order.id}`} className={s.orderLink}>
                  <span>Подробнее</span>
                  <span className={s.linkIcon}>🚀</span>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}