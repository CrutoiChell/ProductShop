import { useState } from "react";
import {
  useCartQuery,
  useCreateOrderMutation,
  useDeleteCartMutation,
  useEditCartMutation,
  useOrdersQuery,
} from "../../App/apiSlice";
import s from "./Cart.module.scss";
import { useNavigate } from "react-router-dom";

export function Cart() {
  let { data: cart, isLoading, error } = useCartQuery();
  let { refetch: refetchOrders } = useOrdersQuery();

  let [editCart] = useEditCartMutation();
  let [deleteCart] = useDeleteCartMutation();
  let [createOrder] = useCreateOrderMutation();

  let nav = useNavigate();

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let [data, setData] = useState({
    payments: "cash",
    type: "pickup",
    delivery_date: tomorrow.toISOString().split("T")[0],
  });

  if (isLoading) return <p>Загрузка...</p>;

  if (error) return <p>Ошибка загрузки профиля!</p>;

  async function PostOrder() {
    await createOrder({
      payments: data.payments,
      type: data.type,
      delivery_date: data.delivery_date,
    });
    nav("/profile");
    refetchOrders();
  }

  if (cart?.length === 0) {
    return <h1>Вы похоже ничего не купили</h1>;
  }

  return (
    <section className={s.cartSection}>
      <div className={s.cartItems}>
        {cart?.map((item) => {
          return (
            <div key={item.id} className={s.cartItem}>
              <div className={s.cartItemDetails}>
                <img
                  src={`http://localhost:5000/api${item.img_url}`}
                  alt={item.title}
                  className={s.cartItemImage}
                />
                <h3 className={s.cartItemTitle}>{item.title}</h3>
                <div className={s.cartItemQuantity}>
                  <button
                    onClick={() =>
                      editCart({ product_id: item.id, count_of_products: item.quantity + 1 })
                    }
                    className={s.cartButton}
                  >
                    +
                  </button>
                  <p className={s.quantityText}>{item.quantity} шт.</p>
                  {item.quantity === 1 ? (
                    ""
                  ) : (
                    <button
                      onClick={() =>
                        editCart({ product_id: item.id, count_of_products: item.quantity - 1 })
                      }
                      className={s.cartButton}
                    >
                      -
                    </button>
                  )}
                </div>
              </div>
              <div className={s.cartItemPrice}>
                <p>{item.price} ₽</p>
                <button onClick={() => deleteCart(item.id)} className={s.removeButton}>
                  Убрать из корзины
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={s.orderDetails}>
        <div className={s.paymentMethod}>
          <p>Способ оплаты</p>
          <div className={s.paymentOption}>
            <input
              type="radio"
              value="cash"
              id="cash"
              name="payment"
              checked={data.payments === "cash"}
              onChange={(e) => setData({ ...data, payments: e.target.value })}
              className={s.customRadio}
            />
            <label htmlFor="cash">Наличными</label>
          </div>
          <div className={s.paymentOption}>
            <input
              type="radio"
              value="credit_card"
              id="credit_card"
              name="payment"
              checked={data.payments === "credit_card"}
              onChange={(e) => setData({ ...data, payments: e.target.value })}
              className={s.customRadio}
            />
            <label htmlFor="credit_card">Картой</label>
          </div>
        </div>

        <div className={s.deliveryMethod}>
          <p>Способ получения</p>
          <div className={s.deliveryOption}>
            <input
              type="radio"
              value="delivery"
              id="delivery"
              name="type"
              checked={data.type === "delivery"}
              onChange={(e) => setData({ ...data, type: e.target.value })}
              className={s.customRadio}
            />
            <label htmlFor="delivery">Доставка</label>
          </div>
          <div className={s.deliveryOption}>
            <input
              type="radio"
              value="pickup"
              id="pickup"
              name="type"
              checked={data.type === "pickup"}
              onChange={(e) => setData({ ...data, type: e.target.value })}
              className={s.customRadio}
            />
            <label htmlFor="pickup">Самовывоз</label>
          </div>
        </div>

        <input
          type="date"
          onChange={(e) => setData({ ...data, delivery_date: e.target.value })}
          value={data.delivery_date}
          className={s.deliveryDate}
        />
      </div>

      <div className={s.totalPrice}>
        <span>
          {cart?.reduce(
            (sum, item) => sum + Number(item.price) * item.quantity,
            0
          ).toFixed(2)}{" "}
          ₽
        </span>
        <button onClick={PostOrder} className={s.orderButton}>
          Оформить
        </button>
      </div>
    </section>
  );
}
