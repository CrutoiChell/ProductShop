import { useState, useRef, useEffect } from "react";
import s from "./SignIn.module.scss";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../App/apiSlice";
import { useDispatch } from "react-redux";
import { setToken } from "../../App/AuthSlice";

export function SignIn() {
  let [data, setData] = useState({ email: "", password: "" });
  let [errors, setErrors] = useState<Record<string, string>>({});
  let [showPassword, setShowPassword] = useState(false);
  let formRef = useRef<HTMLFormElement>(null);
  
  let nav = useNavigate();
  let disp = useDispatch();
  let [signIn, { isLoading }] = useSignInMutation();

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
    
    if (!data.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      newErrors.email = "Некорректный email";
    }
    if (data.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function logIn(e: React.FormEvent) {
    try {
      e.preventDefault();
      
      if (!validate()) return;
      
      let result = await signIn(data).unwrap();
      localStorage.setItem("token", result.token);
      disp(setToken(result.token));
      nav("/");
    } catch (err) {
      console.error("Ошибка входа:", err);
      if ((err as any).data?.message) {
        setErrors({ server: (err as any).data.message });
      } else {
        setErrors({ server: "Неверный email или пароль" });
      }
    }
  }

  return (
    <section className={s.signInSection}>
      <div className={s.stars}>
        {[...Array(50)].map((_, i) => (
          <div key={i} className={s.star}></div>
        ))}
      </div>
      
      <div className={s.planet}></div>
      <div className={s.planetSmall}></div>
      
      <form 
        ref={formRef} 
        onSubmit={logIn} 
        className={s.signInForm}
        noValidate
      >
        <div className={s.formHeader}>
          <div className={s.logo}>AstroMarket</div>
          <h2 className={s.formTitle}>Вход в систему</h2>
          <p className={s.formSubtitle}>Исследуйте космический ассортимент</p>
        </div>
        
        <div className={s.formGroup}>
          <div className={s.inputWrapper}>
            <input
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className={`${s.inputField} ${errors.email ? s.error : ''}`}
            />
            <span className={s.inputIcon}>✉️</span>
          </div>
          {errors.email && <span className={s.errorText}>{errors.email}</span>}
        </div>
        
        <div className={s.formGroup}>
          <div className={s.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className={`${s.inputField} ${errors.password ? s.error : ''}`}
            />
            <span className={s.inputIcon}>🔒</span>
            <button 
              type="button" 
              className={s.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {errors.password && <span className={s.errorText}>{errors.password}</span>}
        </div>
        
        {errors.server && (
          <div className={s.serverError}>{errors.server}</div>
        )}
        
        <button 
          type="submit" 
          className={s.submitButton}
          disabled={isLoading}
        >
          <span>{isLoading ? "Вход..." : "Войти в систему"}</span>
          <span className={s.rocketIcon}>🚀</span>
        </button>
        
        <div className={s.links}>
          <a href="/sign-up" className={s.link}>Создать аккаунт</a>
        </div>
      </form>
    </section>
  );
}