import s from "./Card.module.scss";
import { useState } from "react";
import { useAddOrDeleteFavMutation, useAddToCartMutation, useCheckFavQuery, useProfileQuery } from "../../App/apiSlice";
import { IProduct } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store";
import { Link } from "react-router-dom";

export function Card({
  id,
  title,
  description,
  img_url,
  price,
  count,
  category,
  brand,
  discount,
  composition,
}: IProduct) {
  let [addToCart] = useAddToCartMutation();
  let [AddOrDeleteFav, { error }] = useAddOrDeleteFavMutation();
  let select = useSelector((state: RootState) => state.auth.token);
  let { data: isFav, isLoading } = useCheckFavQuery(id);
  let { data: profile } = useProfileQuery(undefined, { skip: !select });
  
  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка загрузки профиля!</p>;

  return (
    <div className={s.productCard}>
      <div className={s.productCard__imageContainer}>
        <img 
          src={`http://localhost:5000/api${img_url}`} 
          alt={title} 
          className={s.productCard__image} 
        />
      </div>
      <div className={s.productCard__content}>
        <h3 className={s.productCard__title}>{title}</h3>
        <p className={s.productCard__description}>{description}</p>
        <div className={s.productCard__priceBlock}>
          {discount > 0 ? (
            <>
              <p className={s.productCard__oldPrice}>
                <s>{(Number(price) + Number(discount)).toFixed(2)}</s> ₽
              </p>
              <p className={s.productCard__currentPrice}>{price} ₽</p>
            </>
          ) : (
            <p className={s.productCard__currentPrice}>{price} ₽</p>
          )}
        </div>
        {select && profile?.role !== 'admin' && (
          <div className={s.productCard__actions}>
            <button
              className={s.productCard__addToCart}
              onClick={() => addToCart({ product_id: id, count_of_products: 1 })}
            >
              В корзину
            </button>
            <button
              className={s.productCard__addToFav}
              onClick={() => AddOrDeleteFav({ product_id: id, isFav: isFav })}
            >
              {isFav ? 'Убрать из избранного' : 'В Избранное'}
            </button>
          </div>
        )}
        <Link to={`/catalog/${id}`} className={s.productCard__detailsLink}>
          Подробнее
        </Link>
      </div>
    </div>
  );
}