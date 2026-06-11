import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    img: '/img/hero.jpg',
    eyebrow: 'Hecho a mano en Arequipa',
    title: 'Artesanía que conecta con la tierra',
    text: 'Textiles arequipeños tejidos a mano con alpaca, algodón y lana, preservando técnicas ancestrales andinas.',
    cta: { to: '/tienda', label: 'Ver Catálogo' },
  },
  {
    img: '/img/cat-01.jpg',
    eyebrow: 'Colección Alpaca',
    title: 'Abrígate con fibra de los Andes',
    text: 'Chompas, bufandas y chullos tejidos con alpaca suave y cálida. Tallas para toda la familia.',
    cta: { to: '/tienda?cat=CAT-01', label: 'Chompas y Bufandas' },
  },
  {
    img: '/img/cat-02.jpg',
    eyebrow: 'Hogar Andino',
    title: 'Tu casa con alma artesanal',
    text: 'Mantas, cojines y alfombras con patrones tradicionales que transforman cualquier espacio.',
    cta: { to: '/tienda?cat=CAT-02', label: 'Ver Accesorios' },
  },
];

const INTERVAL = 5000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const go = useCallback((i) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [index]);

  return (
    <section className="carousel" aria-label="Promociones destacadas">
      {SLIDES.map((s, i) => (
        <div key={i} className={`carousel-slide ${i === index ? 'active' : ''}`} aria-hidden={i !== index}>
          <img src={s.img} alt="" />
          <div className="carousel-overlay" />
          <div className="carousel-content">
            <span className="carousel-eyebrow">{s.eyebrow}</span>
            <h1>{s.title}</h1>
            <p>{s.text}</p>
            <Link to={s.cta.to} className="btn btn-primary btn-lg">
              {s.cta.label} <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      ))}

      <button className="carousel-arrow prev" aria-label="Anterior" onClick={() => go(index - 1)}>
        <i className="fa-solid fa-chevron-left" />
      </button>
      <button className="carousel-arrow next" aria-label="Siguiente" onClick={() => go(index + 1)}>
        <i className="fa-solid fa-chevron-right" />
      </button>

      <div className="carousel-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            aria-label={`Ir a slide ${i + 1}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </section>
  );
}
