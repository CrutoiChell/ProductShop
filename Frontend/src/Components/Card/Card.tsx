import s from "./Card.module.scss";
import { useState, useEffect } from "react";
import { 
  useAddOrDeleteFavMutation, 
  useAddToCartMutation, 
  useCheckFavQuery, 
  useProfileQuery 
} from "../../App/apiSlice";
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
  let [isHovered, setIsHovered] = useState(false);
  let [isFavState, setIsFavState] = useState(false);
  let [isAnimating, setIsAnimating] = useState(false);
  
  let [addToCart] = useAddToCartMutation();
  let [AddOrDeleteFav, { error }] = useAddOrDeleteFavMutation();
  let select = useSelector((state: RootState) => state.auth.token);
  let { data: isFav, isLoading } = useCheckFavQuery(id);
  let { data: profile } = useProfileQuery(undefined, { skip: !select });
  
  useEffect(() => {
    if (isFav !== undefined) {
      setIsFavState(isFav);
    }
  }, [isFav]);
  
  if (isLoading) return <div className={s.loading}></div>;
  if (error) return <div className={s.error}></div>;

  let handleFavClick = () => {
    setIsAnimating(true);
    AddOrDeleteFav({ product_id: id, isFav: isFavState });
    setIsFavState(!isFavState);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  let discountedPrice = discount > 0 
    ? (Number(price) + Number(discount)).toFixed(2) 
    : null;

  return (
    <div 
      className={s.productCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={s.stars}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className={s.star}></div>
        ))}
      </div>
      
      <div className={s.productCard__imageContainer}>
        <div className={s.imageOverlay}></div>
        <img 
          src={`http://localhost:5000/api${img_url}`} 
          alt={title} 
          className={s.productCard__image} 
        />
        
        <button
          className={`${s.favButton} ${isFavState ? s.active : ''} ${isAnimating ? s.animate : ''}`}
          onClick={handleFavClick}
        >
          {isFavState ? '★' : '☆'}
        </button>
        
        {discount > 0 && (
          <div className={s.discountBadge}>
            -{Math.round((Number(discount) / (Number(price) + Number(discount))) * 100)}%
          </div>
        )}
      </div>
      
      <div className={s.productCard__content}>
        <h3 className={s.productCard__title}>{title}</h3>
        <p className={s.productCard__description}>{description}</p>
        
        <div className={s.productCard__priceBlock}>
          {discountedPrice ? (
            <>
              <p className={s.productCard__oldPrice}>
                <s>{discountedPrice}</s> ₽
              </p>
              <p className={s.productCard__currentPrice}>{price} ₽</p>
            </>
          ) : (
            <p className={s.productCard__currentPrice}>{price} ₽</p>
          )}
        </div>
        
        <div className={s.stockInfo}>
          <span className={s.stockLabel}>На складе:</span>
          <span className={`${s.stockCount} ${count > 0 ? s.inStock : s.outOfStock}`}>
            {count > 0 ? `${count} шт.` : 'Нет в наличии'}
          </span>
        </div>
        
        {select && profile?.role !== 'admin' && (
          <div className={s.productCard__actions}>
            <button
              className={s.productCard__addToCart}
              onClick={() => addToCart({ product_id: id, count_of_products: 1 })}
              disabled={count <= 0}
            >
              <span>В корзину</span>
              <span className={s.cartIcon}>🛒</span>
            </button>
          </div>
        )}
        
        <Link to={`/catalog/${id}`} className={s.productCard__detailsLink}>
          <span>Подробнее</span>
          <span className={s.linkIcon}>🔭</span>
        </Link>
      </div>
    </div>
  );
}