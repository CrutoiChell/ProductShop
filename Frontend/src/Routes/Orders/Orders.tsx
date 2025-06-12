import { useState } from "react";
import s from "./Orders.module.scss";
import { useEditOrderMutation, useGetOrdersQuery } from "../../App/apiSlice";
import { IOrder } from "../../types";

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
  let [selectedStatus, setSelectedStatus] = useState<IOrder['status']>('pending');
  let { data: orders, isLoading } = useGetOrdersQuery({});
  let [editOrder] = useEditOrderMutation();
  let [editableOrder, setEditableOrder] = useState<number | null>(null);
  let [formData, setFormData] = useState<IOrder | null>(null);

  let handleEdit = (order: IOrder) => {
    setEditableOrder(order.id);
    setFormData({ ...order });
  };

  let handleSave = async () => {
    if (formData) {
      await editOrder(formData).unwrap();
      setEditableOrder(null);
    }
  };

  let handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  let filteredOrders = orders?.filter((order: IOrder) =>
    order.status === selectedStatus
  );

  return (
    <div className={s.ordersWrapper}>
      <div className={s.stars}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={s.star}></div>
        ))}
      </div>

      <h2 className={s.title}>Управление заказами</h2>

      <select
        className={s.statusSelect}
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as IOrder['status'])}
      >
        {Object.entries(translate.status).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
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
            {filteredOrders?.map((order: IOrder) => (
              <tr key={order.id}>
                <td>{order.id}</td>

                {editableOrder === order.id ? (
                  <>
                    <td>
                      <select
                        className={s.input}
                        name="type"
                        value={formData?.type || ''}
                        onChange={handleChange}
                      >
                        {Object.entries(translate.type).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className={s.input}
                        name="payments"
                        value={formData?.payments || ''}
                        onChange={handleChange}
                      >
                        {Object.entries(translate.payments).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className={s.input}
                        type="date"
                        name="delivery_date"
                        value={formData?.delivery_date?.slice(0, 10) || ''}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <select
                        className={s.input}
                        name="status"
                        value={formData?.status || ''}
                        onChange={handleChange}
                      >
                        {Object.entries(translate.status).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button className={s.saveBtn} onClick={handleSave}>
                        Сохранить
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{translate.type[order.type]}</td>
                    <td>{translate.payments[order.payments]}</td>
                    <td>{new Date(order.delivery_date).toLocaleDateString("ru-RU")}</td>
                    <td>{translate.status[order.status]}</td>
                    <td>
                      <button
                        className={s.editBtn}
                        onClick={() => handleEdit(order)}
                      >
                        Редактировать
                      </button>
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