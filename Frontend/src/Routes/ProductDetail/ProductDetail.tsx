import { useParams, useNavigate } from "react-router-dom";
import {
    useAddOrDeleteFavMutation,
    useAddToCartMutation,
    useCheckFavQuery,
    useEditCartMutation,
    useGetOneProductQuery,
    useProfileQuery,
    useDeleteProductMutation,
    useEditProductMutation
} from "../../App/apiSlice";
import s from "./ProductDetail.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store";
import { useState, useEffect, useRef } from "react";

export function ProductDetail() {
    let navigate = useNavigate();
    let select = useSelector((state: RootState) => state.auth.token);
    let param = useParams();
    let { data: product, error, isLoading, refetch } = useGetOneProductQuery(param.id);
    let [addToCart] = useAddToCartMutation();
    let [AddOrDeleteFav] = useAddOrDeleteFavMutation();
    let [editCart] = useEditCartMutation();
    let { data: isFav } = useCheckFavQuery(param.id);
    let { data: profile } = useProfileQuery(undefined, { skip: !select });
    let [isEdit, setIsEdit] = useState(false);
    let [deleteProduct] = useDeleteProductMutation();
    let [editProduct] = useEditProductMutation();
    let fileInputRef = useRef<HTMLInputElement>(null);
    let [imagePreview, setImagePreview] = useState<string | null>(null);

    let [editData, setEditData] = useState({
        title: '',
        description: '',
        price: 0,
        count: 0,
        category: '',
        brand: '',
        discount: 0,
        composition: ''
    });

    useEffect(() => {
        if (product) {
            setEditData({
                title: product.title,
                description: product.description,
                price: product.price,
                count: product.count,
                category: product.category,
                brand: product.brand,
                discount: product.discount,
                composition: product.composition
            });
            setImagePreview(null);
        }
    }, [product, isEdit]);

    let handleDelete = async () => {
        try {
            await deleteProduct(product!.id).unwrap();
            navigate('/catalog');
        } catch (err) {
            console.error('Ошибка при удалении:', err);
        }
    };

    let handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('title', editData.title);
        formData.append('description', editData.description);
        formData.append('price', editData.price.toString());
        formData.append('count', editData.count.toString());
        formData.append('category', editData.category);
        formData.append('brand', editData.brand);
        formData.append('discount', editData.discount.toString());
        formData.append('composition', editData.composition);

        if (fileInputRef.current?.files?.[0]) {
            formData.append('image', fileInputRef.current.files[0]);
        }

        try {
            await editProduct({
                id: product!.id,
                body: formData
            }).unwrap();
            setIsEdit(false);
            refetch();
        } catch (err) {
            console.error('Ошибка при редактировании:', err);
        }
    };

    let handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'count' || name === 'discount'
                ? Number(value)
                : value
        }));
    };

    let handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
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
            <p>Ошибка загрузки продукта!</p>
            <p>Попробуйте перезагрузить страницу</p>
        </div>
    );

    if (!product) return <p>Космический продукт не найден</p>;

    return (
        <div className={s.spaceBackground}>
            <div className={s.stars}>
                {[...Array(50)].map((_, i) => (
                    <div key={i} className={s.star}></div>
                ))}
            </div>

            <div className={s.planet}></div>
            <div className={s.asteroid}></div>

            <section className={s.productDetail}>
                {isEdit ? (
                    <form onSubmit={handleEditSubmit} className={s.editForm}>
                        <div className={s.imageSection}>
                            {imagePreview ? (
                                <div className={s.imageWrapper}>
                                    <img src={imagePreview} alt="Предпросмотр" className={s.productImage} />
                                </div>
                            ) : (
                                <div className={s.imageWrapper}>
                                    <img
                                        src={`http://localhost:5000/api${product.img_url}`}
                                        alt={product.title}
                                        className={s.productImage}
                                    />
                                </div>
                            )}
                            <label className={s.fileUpload}>
                                <span className={s.uploadButton}>Выбрать изображение</span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </label>
                        </div>

                        <div className={s.infoSection}>
                            <input
                                type="text"
                                name="title"
                                value={editData.title}
                                onChange={handleChange}
                                placeholder="Название"
                                required
                                className={s.inputField}
                            />

                            <div className={s.priceSection}>
                                <div className={s.inputWrapper}>
                                    <span className={s.currency}>₽</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={editData.price}
                                        onChange={handleChange}
                                        placeholder="Цена"
                                        required
                                        min="0"
                                        step="0.01"
                                        className={`${s.inputField} ${s.priceInput}`}
                                    />
                                </div>

                                <div className={s.inputWrapper}>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={editData.discount}
                                        onChange={handleChange}
                                        placeholder="Скидка"
                                        min="0"
                                        max="100"
                                        step="1"
                                        className={`${s.inputField} ${s.discountInput}`}
                                    />
                                    <span className={s.percent}>%</span>
                                </div>
                            </div>

                            <div className={s.metaSection}>
                                <div className={s.inputWrapper}>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={editData.brand}
                                        onChange={handleChange}
                                        placeholder="Бренд"
                                        className={s.inputField}
                                    />
                                </div>

                                <div className={s.inputWrapper}>
                                    <input
                                        type="text"
                                        name="category"
                                        value={editData.category}
                                        onChange={handleChange}
                                        placeholder="Категория"
                                        className={s.inputField}
                                    />
                                </div>

                                <div className={s.inputWrapper}>
                                    <input
                                        type="number"
                                        name="count"
                                        value={editData.count}
                                        onChange={handleChange}
                                        placeholder="Количество"
                                        min="0"
                                        className={s.inputField}
                                    />
                                </div>
                            </div>

                            <div className={s.textSection}>
                                <h3 className={s.sectionTitle}>Описание</h3>
                                <textarea
                                    name="description"
                                    value={editData.description}
                                    onChange={handleChange}
                                    placeholder="Описание"
                                    rows={5}
                                    className={s.textareaField}
                                />
                            </div>

                            <div className={s.textSection}>
                                <h3 className={s.sectionTitle}>Состав</h3>
                                <textarea
                                    name="composition"
                                    value={editData.composition}
                                    onChange={handleChange}
                                    placeholder="Состав"
                                    rows={3}
                                    className={s.textareaField}
                                />
                            </div>

                            <div className={s.actions}>
                                <button type="submit" className={s.saveButton}>
                                    Сохранить изменения
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEdit(false)}
                                    className={s.cancelButton}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className={s.imageSection}>
                            <div className={s.imageWrapper}>
                                <img
                                    src={`http://localhost:5000/api${product.img_url}`}
                                    alt={product.title}
                                    className={s.productImage}
                                />
                                <div className={s.imageOverlay}></div>
                            </div>
                        </div>

                        <div className={s.infoSection}>
                            {Number(product.discount) > 0 ? (
                                <div className={s.priceContainer}>
                                    <span className={s.oldPrice}>
                                        <s>
                                            {(Number(product.price) + Number(product.discount)).toFixed(2)}
                                        </s>{" "}
                                        ₽
                                    </span>
                                    <div className={s.priceWrapper}>
                                        <span className={s.currentPrice}>
                                            {Number(product.price).toFixed(2)} ₽
                                        </span>
                                        {Number(product.discount) > 0 && (
                                            <div className={s.discountBadge}>
                                                -{Math.round(
                                                    (Number(product.discount) / (Number(product.price) + Number(product.discount))) * 100
                                                )}
                                                %
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className={s.priceContainer}>
                                    <span className={s.currentPrice}>
                                        {Number(product.price).toFixed(2)} ₽
                                    </span>
                                </div>
                            )}

                            <div className={s.metaInfo}>
                                <div className={s.metaItem}>
                                    <span className={s.metaLabel}>Бренд:</span>
                                    <span className={s.metaValue}>{product.brand}</span>
                                </div>
                                <div className={s.metaItem}>
                                    <span className={s.metaLabel}>Категория:</span>
                                    <span className={s.metaValue}>{product.category}</span>
                                </div>
                                <div className={s.metaItem}>
                                    <span className={s.metaLabel}>В наличии:</span>
                                    <span className={s.metaValue}>{product.count} шт.</span>
                                </div>
                            </div>

                            <div className={s.textSection}>
                                <h3 className={s.sectionTitle}>Описание</h3>
                                <p className={s.descriptionText}>{product.description}</p>
                            </div>

                            <div className={s.textSection}>
                                <h3 className={s.sectionTitle}>Состав</h3>
                                <p className={s.compositionText}>{product.composition}</p>
                            </div>

                            {select && (
                                <div className={s.actions}>
                                    {profile?.role === 'admin' ? (
                                        <>
                                            <button
                                                onClick={() => setIsEdit(true)}
                                                className={s.editButton}
                                            >
                                                Редактировать продукт
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className={s.deleteButton}
                                            >
                                                Удалить продукт
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => addToCart({ product_id: product.id, count_of_products: 1 })}
                                                className={s.cartButton}
                                            >
                                                Добавить в корзину
                                            </button>
                                            <button
                                                onClick={() => AddOrDeleteFav({ product_id: product.id, isFav: isFav })}
                                                className={isFav ? s.favButtonActive : s.favButton}
                                            >
                                                {isFav ? '★ В избранном' : '☆ В избранное'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}