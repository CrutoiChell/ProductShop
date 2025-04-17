import { useParams, useNavigate } from "react-router-dom"
import { 
    useAddOrDeleteFavMutation, 
    useAddToCartMutation, 
    useCheckFavQuery, 
    useEditCartMutation, 
    useGetOneProductQuery, 
    useProfileQuery,
    useDeleteProductMutation,
    useEditProductMutation
} from "../../App/apiSlice"
import s from "./ProductDetail.module.scss"
import { useSelector } from "react-redux"
import { RootState } from "../../App/store"
import { useState, useEffect, useRef } from "react"

export function ProductDetail() {
    let navigate = useNavigate()
    let select = useSelector((state: RootState) => state.auth.token)
    let param = useParams()
    let { data: product, error, isLoading, refetch } = useGetOneProductQuery(param.id)
    let [addToCart] = useAddToCartMutation()
    let [AddOrDeleteFav] = useAddOrDeleteFavMutation()
    let [editCart] = useEditCartMutation()
    let { data: isFav } = useCheckFavQuery(param.id)
    let { data: profile } = useProfileQuery(undefined, { skip: !select })
    let [isEdit, setIsEdit] = useState(false)
    let [deleteProduct] = useDeleteProductMutation()
    let [editProduct] = useEditProductMutation()
    let fileInputRef = useRef<HTMLInputElement>(null)
    let [imagePreview, setImagePreview] = useState<string | null>(null)
    
    let [editData, setEditData] = useState({
        title: '',
        description: '',
        price: 0,
        count: 0,
        category: '',
        brand: '',
        discount: 0,
        composition: ''
    })

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
            })
            setImagePreview(null)
        }
    }, [product, isEdit])

    let handleDelete = async () => {
        try {
            await deleteProduct(product!.id).unwrap()
            navigate('/catalog')
        } catch (err) {
            console.error('Ошибка при удалении:', err)
        }
    }

    let handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        let formData = new FormData()
        formData.append('title', editData.title)
        formData.append('description', editData.description)
        formData.append('price', editData.price.toString())
        formData.append('count', editData.count.toString())
        formData.append('category', editData.category)
        formData.append('brand', editData.brand)
        formData.append('discount', editData.discount.toString())
        formData.append('composition', editData.composition)
        
        if (fileInputRef.current?.files?.[0]) {
            formData.append('image', fileInputRef.current.files[0])
        }

        try {
            await editProduct({
                id: product!.id,
                body: formData
            }).unwrap()
            setIsEdit(false)
            refetch()
        } catch (err) {
            console.error('Ошибка при редактировании:', err)
        }
    }

    let handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'count' || name === 'discount' 
                ? Number(value) 
                : value
        }))
    }

    let handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader()
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string)
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }

    if (isLoading) return <p>Загрузка...</p>
    if (error) return <p>Ошибка загрузки профиля!</p>
    if (!product) return <p>Нет данных</p>

    console.log(product.img_url);
    

    return (
        <section className={s.productDetail}>
            {isEdit ? (
                <form onSubmit={handleEditSubmit} className={s.editForm}>
                    <div className={s.imageSection}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="Предпросмотр" />
                        ) : (
                            <img src={`http://localhost:5000/api${product.img_url}`} alt={product.title} />
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div>
                    
                    <div className={s.infoSection}>
                        <input
                            type="text"
                            name="title"
                            value={editData.title}
                            onChange={handleChange}
                            placeholder="Название"
                            required
                        />
                        
                        <div className={s.priceSection}>
                            <input
                                type="number"
                                name="price"
                                value={editData.price}
                                onChange={handleChange}
                                placeholder="Цена"
                                required
                                min="0"
                                step="0.01"
                            />
                            <input
                                type="number"
                                name="discount"
                                value={editData.discount}
                                onChange={handleChange}
                                placeholder="Скидка"
                                min="0"
                                max="1"
                                step="0.01"
                            />
                        </div>

                        <div className={s.metaSection}>
                            <input
                                type="text"
                                name="brand"
                                value={editData.brand}
                                onChange={handleChange}
                                placeholder="Бренд"
                            />
                            <input
                                type="text"
                                name="category"
                                value={editData.category}
                                onChange={handleChange}
                                placeholder="Категория"
                            />
                            <input
                                type="number"
                                name="count"
                                value={editData.count}
                                onChange={handleChange}
                                placeholder="Количество"
                                min="0"
                            />
                        </div>

                        <div className={s.textSection}>
                            <h3>Описание</h3>
                            <textarea
                                name="description"
                                value={editData.description}
                                onChange={handleChange}
                                placeholder="Описание"
                                rows={5}
                            />
                        </div>

                        <div className={s.textSection}>
                            <h3>Состав</h3>
                            <textarea
                                name="composition"
                                value={editData.composition}
                                onChange={handleChange}
                                placeholder="Состав"
                                rows={3}
                            />
                        </div>

                        <div className={s.actions}>
                            <button type="submit">Сохранить</button>
                            <button type="button" onClick={() => setIsEdit(false)}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <>
                    <div className={s.imageSection}>
                        <img src={`http://localhost:5000/api${product.img_url}`} alt={product.title} />
                    </div>
                    
                    <div className={s.infoSection}>
                        <h1>{product.title}</h1>
                        
                        {product.discount > 0 ? (
                            <div className={s.price}>
                                <span className={s.oldPrice}><s>{Number(product.price) + Number(product.discount)}</s>₽</span>
                                <span className={s.currentPrice}>{product.price} ₽</span>
                            </div>
                        ) : (
                            <div className={s.price}>{product.price} ₽</div>
                        )}

                        <div className={s.metaInfo}>
                            <span>Бренд: {product.brand}</span>
                            <span>Категория: {product.category}</span>
                            <span>В наличии: {product.count} шт.</span>
                        </div>

                        <div className={s.textSection}>
                            <h3>Описание</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className={s.textSection}>
                            <h3>Состав</h3>
                            <p>{product.composition}</p>
                        </div>

                        {select && (
                            <div className={s.actions}>
                                {profile?.role === 'admin' ? (
                                    <>
                                        <button onClick={() => setIsEdit(true)}>Редактировать</button>
                                        <button onClick={handleDelete} className={s.deleteBtn}>
                                            Удалить
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => addToCart({ product_id: product.id, count_of_products: 1 })}>
                                            В корзину
                                        </button>
                                        <button onClick={() => AddOrDeleteFav({ product_id: product.id, isFav: isFav })}>
                                            {isFav ? 'Убрать из избранного' : 'В Избранное'}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    )
}