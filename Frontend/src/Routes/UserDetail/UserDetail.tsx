import { useNavigate, useParams } from "react-router-dom"
import {
  useDeleteUserMutation,
  useEditUserMutation,
  useGetOneUserQuery,
} from "../../App/apiSlice"
import s from "./UserDetail.module.scss"
import { useEffect, useState } from "react"

export function UserDetail() {
  let { id } = useParams<string>()
  let { data: profile, isLoading, error } = useGetOneUserQuery(id)
  let [deleteUser] = useDeleteUserMutation()
  let [editUser] = useEditUserMutation()
  let [isEdit, setIsEdit] = useState(false)
  let nav = useNavigate()
  let [formData, setFormData] = useState(profile)

  useEffect(() => {
    setFormData(profile)
  }, [profile])

  if (isLoading) return <div className={s.loading}>Загрузка...</div>
  if (error) return <div className={s.error}>Ошибка загрузки профиля!</div>

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData || !profile) return

    let updatedData = { ...formData }
    let fieldsToCheck = ["name", "email", "password", "role"]

    for (let key in updatedData) {
      if (fieldsToCheck.includes(key) && !updatedData[key]) {
        updatedData[key] = profile[key]
      }
    }

    try {
      await editUser({ id: profile.id, ...updatedData }).unwrap()
      setIsEdit(false)
    } catch (err) {
      console.error("Ошибка при обновлении:", err)
    }
  }

  return (
    <section className={s.userDetail}>
      <div className={s.info}>
        <h2 className={s.title}>Пользователь №{profile?.id}</h2>
        {isEdit ? (
          <form className={s.form} onSubmit={handleEdit}>
            <input className={s.input} name="name" value={formData?.name || ''} onChange={handleChange} />
            <input className={s.input} name="surname" value={formData?.surname || ''} onChange={handleChange} />
            <input className={s.input} name="email" value={formData?.email || ''} onChange={handleChange} />
            <input className={s.input} name="phone_number" value={formData?.phone_number || ''} onChange={handleChange} />
            <input className={s.input} name="password" value={formData?.password || ''} onChange={handleChange} />
            <input className={s.input} name="address" value={formData?.address || ''} onChange={handleChange} />
            <input className={s.input} name="role" value={formData?.role || ''} onChange={handleChange} />
            <button className={s.button} type="submit">Сохранить</button>
          </form>
        ) : (
          <div className={s.userFields}>
            <div className={s.field}>Имя: {profile?.name || 'нет данных'}</div>
            <div className={s.field}>Фамилия: {profile?.surname || 'нет данных'}</div>
            <div className={s.field}>Почта: {profile?.email || 'нет данных'}</div>
            <div className={s.field}>Номер телефона: {profile?.phone_number || 'нет данных'}</div>
            <div className={s.field}>Пароль: {profile?.password || 'нет данных'}</div>
            <div className={s.field}>Адрес: {profile?.address || 'нет данных'}</div>
            <div className={s.field}>Роль: {profile?.role || 'нет данных'}</div>
          </div>
        )}
      </div>
      <div className={s.buttons}>
        <button className={s.deleteBtn} onClick={() => { deleteUser(profile?.id); nav('/admin/users') }}>Удалить</button>
        <button className={s.editBtn} onClick={() => setIsEdit(!isEdit)}>
          {isEdit ? 'Отменить' : 'Изменить'}
        </button>
      </div>
    </section>
  )
}
