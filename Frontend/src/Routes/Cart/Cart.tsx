import { useState, useEffect } from "react";
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

  let [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (cart && cart.length > 0) {
      let total = cart.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );
      setTotalPrice(total);
    }
  }, [cart]);

  if (isLoading) return (
    <div className={s.loading}>
      <div className={s.loader}></div>
      <p>Загрузка корзины...</p>
    </div>
  );

  if (error) return (
    <div className={s.error}>
      <div className={s.errorIcon}>⚠️</div>
      <p>Ошибка загрузки корзины!</p>
      <p>Попробуйте перезагрузить страницу</p>
    </div>
  );

  async function PostOrder() {
    try {
      await createOrder({
        payments: data.payments,
        type: data.type,
        delivery_date: data.delivery_date,
      }).unwrap();
      nav("/profile");
      refetchOrders();
    } catch (err) {
      console.error("Ошибка оформления заказа:", err);
      alert("Произошла ошибка при оформлении заказа");
    }
  }

  if (cart?.length === 0) {
    return (
      <div className={s.emptyCart}>
        <div className={s.stars}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className={s.star}></div>
          ))}
        </div>
        
        <div className={s.planet}></div>
        <div className={s.asteroid}></div>
        
        <div className={s.emptyContent}>
          <div className={s.emptyIcon}>🛒</div>
          <h2 className={s.emptyTitle}>Космическая корзина пуста</h2>
          <p className={s.emptyText}>Отправляйтесь за покупками в наш космический каталог</p>
          <button onClick={() => nav("/catalog")} className={s.catalogButton}>
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className={s.cartSection}>
      <div className={s.stars}>
        {[...Array(50)].map((_, i) => (
          <div key={i} className={s.star}></div>
        ))}
      </div>
      
      <div className={s.planet}></div>
      <div className={s.asteroid}></div>
      
      <h1 className={s.cartTitle}>Космическая корзина</h1>
      
      <div className={s.cartContent}>
        <div className={s.cartItems}>
          {cart?.map((item) => {
            return (
              <div key={item.id} className={s.cartItem}>
                <div className={s.cartItemDetails}>
                  <div className={s.imageContainer}>
                    <img
                      src={`http://localhost:5000/api${item.img_url}`}
                      alt={item.title}
                      className={s.cartItemImage}
                    />
                    <div className={s.imageOverlay}></div>
                  </div>
                  
                  <div className={s.itemInfo}>
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
                        <div className={s.disabledButton}>-</div>
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
                </div>
                
                <div className={s.cartItemPrice}>
                  <p className={s.priceValue}>{(item.price * item.quantity).toFixed(2)} ₽</p>
                  <p className={s.pricePerItem}>{item.price} ₽/шт</p>
                  <button onClick={() => deleteCart(item.id)} className={s.removeButton}>
                    Убрать
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={s.orderDetails}>
          <div className={s.section}>
            <h3 className={s.sectionTitle}>Способ оплаты</h3>
            <div className={s.optionsGroup}>
              <label className={s.option}>
                <input
                  type="radio"
                  value="cash"
                  name="payment"
                  checked={data.payments === "cash"}
                  onChange={(e) => setData({ ...data, payments: e.target.value })}
                  className={s.customRadio}
                />
                <span className={s.radioLabel}></span>
                <span className={s.optionText}>Наличными</span>
              </label>
              
              <label className={s.option}>
                <input
                  type="radio"
                  value="credit_card"
                  name="payment"
                  checked={data.payments === "credit_card"}
                  onChange={(e) => setData({ ...data, payments: e.target.value })}
                  className={s.customRadio}
                />
                <span className={s.radioLabel}></span>
                <span className={s.optionText}>Картой</span>
              </label>
            </div>
          </div>
          
          <div className={s.section}>
            <h3 className={s.sectionTitle}>Способ получения</h3>
            <div className={s.optionsGroup}>
              <label className={s.option}>
                <input
                  type="radio"
                  value="delivery"
                  name="type"
                  checked={data.type === "delivery"}
                  onChange={(e) => setData({ ...data, type: e.target.value })}
                  className={s.customRadio}
                />
                <span className={s.radioLabel}></span>
                <span className={s.optionText}>Доставка</span>
              </label>
              
              <label className={s.option}>
                <input
                  type="radio"
                  value="pickup"
                  name="type"
                  checked={data.type === "pickup"}
                  onChange={(e) => setData({ ...data, type: e.target.value })}
                  className={s.customRadio}
                />
                <span className={s.radioLabel}></span>
                <span className={s.optionText}>Самовывоз</span>
              </label>
            </div>
          </div>
          
          <div className={s.section}>
            <h3 className={s.sectionTitle}>Дата доставки</h3>
            <div className={s.datePicker}>
              <input
                type="date"
                onChange={(e) => setData({ ...data, delivery_date: e.target.value })}
                value={data.delivery_date}
                className={s.deliveryDate}
              />
              <span className={s.dateIcon}>📅</span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.totalPrice}>
        <div className={s.priceInfo}>
          <span className={s.priceLabel}>Итого:</span>
          <span className={s.priceValue}>{totalPrice.toFixed(2)} ₽</span>
        </div>
        <button onClick={PostOrder} className={s.orderButton}>
          <span>Оформить заказ</span>
          <span className={s.rocketIcon}>🚀</span>
        </button>
      </div>
    </section>
  );
}