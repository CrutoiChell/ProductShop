import { useState } from "react";
import s from "./SignIn.module.scss";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../App/apiSlice";
import { useDispatch } from "react-redux";
import { setToken } from "../../App/AuthSlice";

export function SignIn() {
  let [data, setData] = useState({ email: "", password: "" });
  let [rPassword, setRPassword] = useState("");

  let nav = useNavigate();
  let disp = useDispatch();
  let [signIn] = useSignInMutation();

  async function logIn(e: React.FormEvent) {
    try {
      e.preventDefault();
      if (rPassword === data.password) {
        let result = await signIn(data);
        console.log(result.data.token);
        localStorage.setItem("token", result.data.token);
        disp(setToken(result.data.token));
        nav("/");
      } else {
        console.log("Пароли не одинаковые");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className={s.signInSection}>
      <form onSubmit={logIn} className={s.signInForm}>
        <h2 className={s.formTitle}>Вход в AstroMarket</h2>
        <input
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
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
        <button type="submit" className={s.submitButton}>
          Войти
        </button>
      </form>
    </section>
  );
}
