import { data, useParams } from "react-router-dom";
import { useOrderQuery, useProductsQuery } from "../../App/apiSlice";
import s from "./OrderDetail.module.scss";
import { Card } from "../../Components/Card/Card";

export function OrderDetail() {
    let { id } = useParams();
    let { data: order, isLoading, error } = useOrderQuery(id!);
    let { data: products } = useProductsQuery()
    if (isLoading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка загрузки заказа!</p>;


    if (!order) return <p>Заказ не найден!</p>;

    let statusMap = {
        pending: 'В обработке',
        processing: 'Обрабатывается',
        completed: 'Завершено',
        cancelled: 'Отменено',
    };

    let typeMap = {
        delivery: 'Доставка',
        pickup: 'Самовывоз'
    }

    let paymentsMap = {
        credit_card: 'По карте',
        cash: 'Наличкой'
    }

    // console.log(order);

    return (
        <section className={s.orderDetail}>
            <h2>Детали заказа #{order.id}</h2>
            <p>Дата создания: {order.created_at.slice(0, 10).split('-').reverse().join('.')}</p>
            <p>Дата доставки: {order.delivery_date.slice(0, 10).split('-').reverse().join('.')}</p>
            <p>Способ оплаты: {paymentsMap[order.payments]}</p>
            <p>Статус: {statusMap[order.status]}</p>
            <p>Тип: {typeMap[order.type]}</p>
            <div>
                {
                    order.products?.map((item) => {
                        return (
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
                        )
                    })
                }
            </div>
            <p>Всего: {order.total} ₽</p>
        </section>
    );
};