import s from "./CreateProduct.module.scss"
import { useCreateProductMutation } from "../../App/apiSlice"
import { useState, useRef } from "react"

export function CreateProduct() {
  let [createProduct, { isLoading }] = useCreateProductMutation()
  let fileInputRef = useRef(null)
  let [preview, setPreview] = useState(null)
  let [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    count: '',
    category: '',
    brand: '',
    discount: '',
    composition: ''
  })

  let handleChange = (e) => {
    let { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  let handleFileChange = (e) => {
    let file = e.target.files[0]
    if (file) {
      let reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  let handleSubmit = async (e) => {
    e.preventDefault()

    let data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('price', formData.price)
    data.append('count', formData.count)
    data.append('category', formData.category)
    data.append('brand', formData.brand)
    data.append('discount', formData.discount)
    data.append('composition', formData.composition)

    if (fileInputRef.current.files[0]) {
      data.append('image', fileInputRef.current.files[0])
    }

    try {
      await createProduct(data).unwrap()
      setFormData({
        title: '',
        description: '',
        price: '',
        count: '',
        category: '',
        brand: '',
        discount: '',
        composition: ''
      })
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      alert('Товар успешно создан!')
    } catch (err) {
      console.error('Ошибка создания товара:', err)
      alert('Произошла ошибка при создании товара')
    }
  }

  return (
    <div className={s.createProductForm}>
      <h2 className={s.heading}>Добавить новый товар</h2>
      <form className={s.form} onSubmit={handleSubmit}>
        <div className={s.formGroup}>
          <label className={s.label}>Название товара*</label>
          <input
            className={s.input}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={s.formGroup}>
          <label className={s.label}>Описание</label>
          <textarea
            className={s.textarea}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className={s.formRow}>
          <div className={s.formGroup}>
            <label className={s.label}>Цена*</label>
            <input
              className={s.input}
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className={s.formGroup}>
            <label className={s.label}>Количество*</label>
            <input
              className={s.input}
              type="number"
              name="count"
              value={formData.count}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className={s.formRow}>
          <div className={s.formGroup}>
            <label className={s.label}>Категория</label>
            <input
              className={s.input}
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className={s.formGroup}>
            <label className={s.label}>Бренд</label>
            <input
              className={s.input}
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={s.formGroup}>
          <label className={s.label}>Скидка</label>
          <input
            className={s.input}
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            max="1"
            step="0.01"
          />
        </div>

        <div className={s.formGroup}>
          <label className={s.label}>Состав</label>
          <textarea
            className={s.textarea}
            name="composition"
            value={formData.composition}
            onChange={handleChange}
          />
        </div>

        <div className={s.formGroup}>
          <label className={s.label}>Изображение товара</label>
          <input
            className={s.fileInput}
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
          {preview && (
            <div className={s.imagePreview}>
              <img className={s.previewImg} src={preview} alt="Предпросмотр" />
            </div>
          )}
        </div>

        <button className={s.submitBtn} type="submit" disabled={isLoading}>
          {isLoading ? 'Создание...' : 'Создать товар'}
        </button>
      </form>
    </div>
  )
}
