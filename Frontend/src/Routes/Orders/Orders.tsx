import { useState } from "react";
import s from "./Orders.module.scss";
import { useEditOrderMutation, useGetOrdersQuery } from "../../App/apiSlice";

let translate = {
  payments: {
    credit_card: 'Карта',
    cash: 'Наличные',
  },
  type: {
    delivery: 'Доставка',
    pickup: 'Самовывоз',
  },
  status: {
    pending: 'Ожидает',
    processing: 'В обработке',
    completed: 'Завершён',
    cancelled: 'Отменён',
  },
};

export function Orders() {
  let [selectedStatus, setSelectedStatus] = useState<'pending' | 'processing' | 'completed' | 'cancelled'>('pending');
  let { data: orders, isLoading } = useGetOrdersQuery();
  let [editOrder] = useEditOrderMutation();
  let [editableOrder, setEditableOrder] = useState<number | null>(null);
  let [formData, setFormData] = useState<any>({});

  let handleEdit = (order: any) => {
    setEditableOrder(order.id);
    setFormData({ ...order });
  };

  let handleSave = async () => {
    await editOrder(formData);
    setEditableOrder(null);
  };

  let handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  let filteredOrders = orders?.filter((order: any) => order.status === selectedStatus);

  return (
    <div className={s.ordersWrapper}>
      <h2 className={s.title}>Управление заказами</h2>

      <select className={s.statusSelect} value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as any)}>
        <option value="pending">Ожидает</option>
        <option value="processing">В обработке</option>
        <option value="completed">Завершён</option>
        <option value="cancelled">Отменён</option>
      </select>

      {isLoading ? (
        <div className={s.loading}>Загрузка...</div>
      ) : (
        <table className={s.ordersTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Тип</th>
              <th>Оплата</th>
              <th>Дата доставки</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.map((order: any) => (
              <tr key={order.id}>
                <td>{order.id}</td>

                {editableOrder === order.id ? (
                  <>
                    <td>
                      <select className={s.input} name="type" value={formData.type} onChange={handleChange}>
                        <option value="delivery">Доставка</option>
                        <option value="pickup">Самовывоз</option>
                      </select>
                    </td>
                    <td>
                      <select className={s.input} name="payments" value={formData.payments} onChange={handleChange}>
                        <option value="credit_card">Карта</option>
                        <option value="cash">Наличные</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className={s.input}
                        type="date"
                        name="delivery_date"
                        value={formData.delivery_date?.slice(0, 10)}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <select className={s.input} name="status" value={formData.status} onChange={handleChange}>
                        <option value="pending">Ожидает</option>
                        <option value="processing">В обработке</option>
                        <option value="completed">Завершён</option>
                        <option value="cancelled">Отменён</option>
                      </select>
                    </td>
                    <td>
                      <button className={s.saveBtn} onClick={handleSave}>Сохранить</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{translate.type[order.type]}</td>
                    <td>{translate.payments[order.payments]}</td>
                    <td>{new Date(order.delivery_date).toLocaleDateString("ru-RU")}</td>
                    <td>{translate.status[order.status]}</td>
                    <td>
                      <button className={s.editBtn} onClick={() => handleEdit(order)}>Редактировать</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
