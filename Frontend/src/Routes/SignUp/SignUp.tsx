import { useState, useRef, useEffect } from "react";
import s from "./SignUp.module.scss";
import { useSignUpMutation } from "../../App/apiSlice";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  let [data, setData] = useState({
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    password: "",
    address: "",
  });
  let [rPassword, setRPassword] = useState("");
  let [passwordsMatch, setPasswordsMatch] = useState(true);
  let [errors, setErrors] = useState<Record<string, string>>({});
  let formRef = useRef<HTMLFormElement>(null);

  let nav = useNavigate();
  let [signUp] = useSignUpMutation();

  useEffect(() => {
    let stars = document.querySelectorAll(`.${s.star}`);
    stars.forEach(star => {
      let el = star as HTMLElement;
      let size = Math.random() * 3;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.animationDelay = `${Math.random() * 5}s`;
    });
  }, []);

  let validate = () => {
    let newErrors: Record<string, string> = {};

    if (!data.name.trim()) newErrors.name = "Имя обязательно";
    if (!data.surname.trim()) newErrors.surname = "Фамилия обязательна";
    if (!data.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      newErrors.email = "Некорректный email";
    }
    if (!data.phone_number.match(/^\+?[1-9]\d{10,14}$/)) {
      newErrors.phone_number = "Некорректный номер телефона";
    }
    if (data.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }
    if (data.password !== rPassword) {
      newErrors.rPassword = "Пароли не совпадают";
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
    if (!data.address.trim()) newErrors.address = "Адрес обязателен";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function createUser(e: React.FormEvent) {
    try {
      e.preventDefault();

      if (!validate()) return;

      await signUp(data).unwrap();
      nav("/sign-in");
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      if ((err as any).data?.message) {
        setErrors({ server: (err as any).data.message });
      } else {
        setErrors({ server: "Произошла ошибка при регистрации" });
      }
    }
  }

  return (
    <section className={s.signUpSection}>
      <div className={s.stars}>
        {[...Array(50)].map((_, i) => (
          <div key={i} className={s.star}></div>
        ))}
      </div>

      <div className={s.planet}></div>
      <div className={s.planetSmall}></div>

      <form
        ref={formRef}
        onSubmit={createUser}
        className={s.signUpForm}
        noValidate
      >
        <div className={s.formHeader}>
          <div className={s.logo}>AstroMarket</div>
          <h2 className={s.formTitle}>Регистрация</h2>
          <p className={s.formSubtitle}>Создайте свой космический аккаунт</p>
        </div>

        <div className={s.formRow}>
          <div className={s.formGroup}>
            <input
              type="text"
              placeholder="Имя"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className={`${s.inputField} ${errors.name ? s.error : ''}`}
            />
            {errors.name && <span className={s.errorText}>{errors.name}</span>}
          </div>

          <div className={s.formGroup}>
            <input
              type="text"
              placeholder="Фамилия"
              value={data.surname}
              onChange={(e) => setData({ ...data, surname: e.target.value })}
              className={`${s.inputField} ${errors.surname ? s.error : ''}`}
            />
            {errors.surname && <span className={s.errorText}>{errors.surname}</span>}
          </div>
        </div>

        <div className={s.formGroup}>
          <input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className={`${s.inputField} ${errors.email ? s.error : ''}`}
          />
          {errors.email && <span className={s.errorText}>{errors.email}</span>}
        </div>

        <div className={s.formGroup}>
          <input
            type="tel"
            placeholder="Номер телефона"
            value={data.phone_number}
            onChange={(e) => setData({ ...data, phone_number: e.target.value })}
            className={`${s.inputField} ${errors.phone_number ? s.error : ''}`}
          />
          {errors.phone_number && <span className={s.errorText}>{errors.phone_number}</span>}
        </div>

        <div className={s.formRow}>
          <div className={s.formGroup}>
            <input
              type="password"
              placeholder="Пароль"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className={`${s.inputField} ${errors.password ? s.error : ''}`}
            />
            {errors.password && <span className={s.errorText}>{errors.password}</span>}
          </div>

          <div className={s.formGroup}>
            <input
              type="password"
              placeholder="Повторите пароль"
              value={rPassword}
              onChange={(e) => setRPassword(e.target.value)}
              className={`${s.inputField} ${!passwordsMatch ? s.error : ''}`}
            />
            {!passwordsMatch && <span className={s.errorText}>Пароли не совпадают</span>}
          </div>
        </div>

        <div className={s.formGroup}>
          <input
            type="text"
            placeholder="Адрес"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className={`${s.inputField} ${errors.address ? s.error : ''}`}
          />
          {errors.address && <span className={s.errorText}>{errors.address}</span>}
        </div>

        {errors.server && (
          <div className={s.serverError}>{errors.server}</div>
        )}

        <button type="submit" className={s.submitButton}>
          <span>Зарегистрироваться</span>
          <span className={s.rocketIcon}>🚀</span>
        </button>

        <div className={s.loginLink}>
          Уже есть аккаунт? <a href="/sign-in" className={s.link}>Войти</a>
        </div>
      </form>
    </section>
  );
}