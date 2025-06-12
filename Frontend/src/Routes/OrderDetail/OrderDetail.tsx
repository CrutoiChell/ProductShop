import { useParams } from "react-router-dom";
import { useOrderQuery, useProductsQuery } from "../../App/apiSlice";
import s from "./OrderDetail.module.scss"; 
import { Card } from "../../Components/Card/Card";

export function OrderDetail() {
    let { id } = useParams();
    let { data: order, isLoading, error } = useOrderQuery(id!);
    
    if (isLoading) return (
        <div className={s.loading}>
            <div className={s.loader}></div>
            <p>Загрузка данных заказа...</p>
        </div>
    );
    
    if (error) return (
        <div className={s.error}>
            <div className={s.errorIcon}>⚠️</div>
            <p>Ошибка загрузки заказа!</p>
            <p>Попробуйте перезагрузить страницу</p>
        </div>
    );
    
    if (!order) return <p>Космический заказ не найден!</p>;

    let statusMap = {
        pending: 'В обработке',
        processing: 'Обрабатывается',
        completed: 'Завершён',
        cancelled: 'Отменён',
    };

    let typeMap = {
        delivery: 'Доставка',
        pickup: 'Самовывоз'
    }

    let paymentsMap = {
        credit_card: 'Картой',
        cash: 'Наличными'
    }

    let formatDate = (dateString: string) => {
        return dateString.slice(0, 10).split('-').reverse().join('.');
    };

    return (
        <div className={s.spaceBackground}>
            <div className={s.stars}>
                {[...Array(50)].map((_, i) => (
                    <div key={i} className={s.star}></div>
                ))}
            </div>
            
            <div className={s.planet}></div>
            <div className={s.asteroid}></div>
            
            <section className={s.orderDetail}>
                <div className={s.orderHeader}>
                    <h2 className={s.orderTitle}>
                        <span>Детали заказа</span>
                        <span className={s.orderId}>#{order.id}</span>
                    </h2>
                    <div className={s.statusBadgeContainer}>
                        <div className={`${s.statusBadge} ${s[order.status]}`}>
                            {statusMap[order.status]}
                        </div>
                    </div>
                </div>
                
                <div className={s.orderInfo}>
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>📅</div>
                        <div>
                            <h3 className={s.infoTitle}>Дата создания</h3>
                            <p className={s.infoValue}>{formatDate(order.created_at)}</p>
                        </div>
                    </div>
                    
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>🚚</div>
                        <div>
                            <h3 className={s.infoTitle}>Дата доставки</h3>
                            <p className={s.infoValue}>{formatDate(order.delivery_date)}</p>
                        </div>
                    </div>
                    
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>💳</div>
                        <div>
                            <h3 className={s.infoTitle}>Способ оплаты</h3>
                            <p className={s.infoValue}>{paymentsMap[order.payments]}</p>
                        </div>
                    </div>
                    
                    <div className={s.infoCard}>
                        <div className={s.infoIcon}>📦</div>
                        <div>
                            <h3 className={s.infoTitle}>Тип получения</h3>
                            <p className={s.infoValue}>{typeMap[order.type]}</p>
                        </div>
                    </div>
                </div>
                
                <h3 className={s.productsTitle}>Товары в заказе:</h3>
                <div className={s.productsGrid}>
                    {order.products?.map((item) => (
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
                </div>
                
                <div className={s.totalPrice}>
                    <span className={s.totalLabel}>Итого:</span>
                    <span className={s.totalValue}>{order.total} ₽</span>
                </div>
            </section>
        </div>
    );
};