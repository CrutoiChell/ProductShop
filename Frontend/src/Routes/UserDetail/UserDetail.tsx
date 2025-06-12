import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteUserMutation,
  useEditUserMutation,
  useGetOneUserQuery,
} from "../../App/apiSlice";
import s from "./UserDetail.module.scss";
import { useEffect, useState } from "react";
import { IUserProfile } from "../../types";

export function UserDetail() {
  const { id } = useParams<string>();
  const { data: profile, isLoading, error } = useGetOneUserQuery(id!);
  const [deleteUser] = useDeleteUserMutation();
  const [editUser] = useEditUserMutation();
  const [isEdit, setIsEdit] = useState(false);
  const nav = useNavigate();
  const [formData, setFormData] = useState<IUserProfile | null>(null);
  const [activeStar, setActiveStar] = useState(0);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
    
    const interval = setInterval(() => {
      setActiveStar(prev => (prev + 1) % 5);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [profile]);

  if (isLoading) return (
    <div className={s.loading}>
      <div className={s.loader}></div>
      <p>Загрузка космических данных...</p>
    </div>
  );
  
  if (error) return (
    <div className={s.error}>
      <div className={s.errorIcon}>⚠️</div>
      <p>Ошибка загрузки профиля!</p>
      <p>Попробуйте перезагрузить страницу</p>
    </div>
  );
  
  if (!profile) return (
    <div className={s.error}>
      <div className={s.errorIcon}>🌌</div>
      <p>Профиль не найден!</p>
      <button onClick={() => nav('/admin/users')} className={s.backButton}>
        Вернуться к списку
      </button>
    </div>
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : prev);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData || !profile) return;

    try {
      await editUser(formData).unwrap();
      setIsEdit(false);
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
    }
  }

  const handleDelete = () => {
    if (profile) {
      deleteUser(profile.id);
      nav('/admin/users');
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setFormData(profile);
  };

  return (
    <section className={s.userDetail}>
      <div className={s.stars}>
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`${s.star} ${i === activeStar ? s.active : ''}`}
          ></div>
        ))}
      </div>
      
      <div className={s.planet}></div>
      
      <div className={s.header}>
        <h2 className={s.title}>
          <span>Пользователь #{profile.id}</span>
          <span className={s.subtitle}>Космический профиль</span>
        </h2>
        <div className={s.roleBadge}>{profile.role}</div>
      </div>
      
      {isEdit ? (
        <form className={s.form} onSubmit={handleEdit}>
          <div className={s.formGrid}>
            <div className={s.formGroup}>
              <label className={s.label}>Имя</label>
              <input 
                className={s.input} 
                name="name" 
                value={formData?.name || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div className={s.formGroup}>
              <label className={s.label}>Фамилия</label>
              <input 
                className={s.input} 
                name="surname" 
                value={formData?.surname || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div className={s.formGroup}>
              <label className={s.label}>Email</label>
              <input 
                className={s.input} 
                name="email" 
                value={formData?.email || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div className={s.formGroup}>
              <label className={s.label}>Телефон</label>
              <input 
                className={s.input} 
                name="phone_number" 
                value={formData?.phone_number || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div className={s.formGroup}>
              <label className={s.label}>Новый пароль</label>
              <input 
                className={s.input} 
                name="password" 
                type="password"
                placeholder="Введите новый пароль"
                value={formData?.password || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div className={s.formGroup}>
              <label className={s.label}>Адрес</label>
              <input 
                className={s.input} 
                name="address" 
                value={formData?.address || ''} 
                onChange={handleChange} 
              />
            </div>
            
            <div className={s.formGroup}>
              <label className={s.label}>Роль</label>
              <input 
                className={s.input} 
                name="role" 
                value={formData?.role || ''} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className={s.formButtons}>
            <button className={s.cancelButton} type="button" onClick={handleCancel}>
              Отменить
            </button>
            <button className={s.saveButton} type="submit">
              Сохранить изменения
            </button>
          </div>
        </form>
      ) : (
        <div className={s.userInfo}>
          <div className={s.infoCard}>
            <div className={s.cardHeader}>
              <div className={s.cardIcon}>👤</div>
              <h3 className={s.cardTitle}>Личные данные</h3>
            </div>
            <div className={s.field}>
              <span className={s.fieldLabel}>Имя:</span>
              <span className={s.fieldValue}>{profile.name || 'нет данных'}</span>
            </div>
            <div className={s.field}>
              <span className={s.fieldLabel}>Фамилия:</span>
              <span className={s.fieldValue}>{profile.surname || 'нет данных'}</span>
            </div>
          </div>
          
          <div className={s.infoCard}>
            <div className={s.cardHeader}>
              <div className={s.cardIcon}>📱</div>
              <h3 className={s.cardTitle}>Контактные данные</h3>
            </div>
            <div className={s.field}>
              <span className={s.fieldLabel}>Email:</span>
              <span className={s.fieldValue}>{profile.email || 'нет данных'}</span>
            </div>
            <div className={s.field}>
              <span className={s.fieldLabel}>Телефон:</span>
              <span className={s.fieldValue}>{profile.phone_number || 'нет данных'}</span>
            </div>
          </div>
          
          <div className={s.infoCard}>
            <div className={s.cardHeader}>
              <div className={s.cardIcon}>📍</div>
              <h3 className={s.cardTitle}>Адрес</h3>
            </div>
            <div className={s.field}>
              <span className={s.fieldValue}>{profile.address || 'нет данных'}</span>
            </div>
          </div>
          
          <div className={s.infoCard}>
            <div className={s.cardHeader}>
              <div className={s.cardIcon}>🔑</div>
              <h3 className={s.cardTitle}>Учетные данные</h3>
            </div>
            <div className={s.field}>
              <span className={s.fieldLabel}>Роль:</span>
              <span className={s.fieldValue}>{profile.role || 'нет данных'}</span>
            </div>
            <div className={s.field}>
              <span className={s.fieldLabel}>ID:</span>
              <span className={s.fieldValue}>{profile.id}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className={s.buttons}>
        <button className={s.deleteButton} onClick={handleDelete}>
          <span>Удалить пользователя</span>
          <span className={s.buttonIcon}>🗑️</span>
        </button>
        <button 
          className={s.editButton} 
          onClick={() => isEdit ? handleCancel() : setIsEdit(true)}
        >
          <span>{isEdit ? 'Отменить редактирование' : 'Редактировать профиль'}</span>
          <span className={s.buttonIcon}>{isEdit ? '✖' : '✏️'}</span>
        </button>
      </div>
    </section>
  );
}