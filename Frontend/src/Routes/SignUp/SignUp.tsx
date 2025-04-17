import { useState } from "react";
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

  let nav = useNavigate();
  let [signUp] = useSignUpMutation();

  async function createUser(e: React.FormEvent) {
    try {
      e.preventDefault();
      if (rPassword === data.password) {
        await signUp(data);
        nav("/sign-in");
      } else {
        console.log("пароли не одинаковые");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className={s.signUpSection}>
      <form onSubmit={createUser} className={s.signUpForm}>
        <h2 className={s.formTitle}>Регистрация</h2>
        <input
          type="text"
          placeholder="Имя"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className={s.inputField}
        />
        <input
          type="text"
          placeholder="Фамилия"
          value={data.surname}
          onChange={(e) => setData({ ...data, surname: e.target.value })}
          className={s.inputField}
        />
        <input
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className={s.inputField}
        />
        <input
          type="tel"
          placeholder="Номер телефона"
          value={data.phone_number}
          onChange={(e) => setData({ ...data, phone_number: e.target.value })}
          className={s.inputField}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          className={s.inputField}
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          value={rPassword}
          onChange={(e) => setRPassword(e.target.value)}
          className={s.inputField}
        />
        <input
          type="text"
          placeholder="Адрес"
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
          className={s.inputField}
        />
        <button type="submit" className={s.submitButton}>
          Зарегистрироваться
        </button>
      </form>
    </section>
  );
}
