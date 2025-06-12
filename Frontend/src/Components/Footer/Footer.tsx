import s from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.cosmicBorder}></div>
      
      <div className={s.content}>
        <div className={s.logoGroup}>
          <div className={s.logo}>AstroMarket</div>
          <div className={s.tagline}>Космические товары для земных потребностей</div>
        </div>
        
        <div className={s.contact}>
          <div className={s.contactItem}>
            <span className={s.contactLabel}>Орбита связи:</span>
            <span>support@astromarket.com</span>
          </div>
          <div className={s.contactItem}>
            <span className={s.contactLabel}>Галактический телефон:</span>
            <span>+7 (495) 123-45-67</span>
          </div>
        </div>
      </div>
      
      <div className={s.copyright}>
        © {new Date().getFullYear()} AstroMarket • Межгалактическая торговая платформа
      </div>
      
      <div className={s.stars}>
        {[...Array(25)].map((_, i) => (
          <div key={i} className={s.star} style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }}></div>
        ))}
      </div>
    </footer>
  );
}