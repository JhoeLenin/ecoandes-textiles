const VALUES = [
  { icon: 'fa-hands', title: 'Tradición', text: 'Técnicas ancestrales andinas vivas en cada tejido.' },
  { icon: 'fa-award', title: 'Calidad', text: 'Fibras naturales seleccionadas y acabados a mano.' },
  { icon: 'fa-leaf', title: 'Sostenibilidad', text: 'Producción responsable con la tierra y su gente.' },
  { icon: 'fa-handshake', title: 'Comercio Justo', text: 'Pago digno y directo a comunidades artesanas.' },
];

export default function About() {
  return (
    <>
      <section className="page-hero">
        <h1>Sobre Nosotros</h1>
        <p>Artesanía que conecta con la tierra</p>
      </section>

      <section className="section">
        <div className="container content-block">
          <h2>Nuestra Historia</h2>
          <p>
            Somos una familia de artesanos arequipeños con 20 años de experiencia en textiles
            andinos. Trabajamos con fibras naturales como alpaca, algodón y lana de oveja,
            respetando técnicas ancestrales transmitidas de generación en generación y apoyando
            el comercio justo con comunidades locales.
          </p>

          <h2>Misión</h2>
          <p>
            Ofrecer productos textiles artesanales de calidad, preservando técnicas tradicionales
            andinas y generando desarrollo sostenible para nuestras comunidades.
          </p>

          <h2>Visión</h2>
          <p>
            Ser la tienda virtual líder en artesanía textil sudamericana, reconocida por
            autenticidad y compromiso social para el año 2030.
          </p>

          <h2>Nuestros Valores</h2>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div className="value-card" key={v.title}>
                <i className={`fa-solid ${v.icon}`} />
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>

          <h2>Nuestro Trabajo</h2>
          <div className="gallery-grid">
            <img src="/img/nosotros-1.jpg" alt="Tejido en telar tradicional" />
            <img src="/img/nosotros-2.jpg" alt="Artesana trabajando" />
            <img src="/img/nosotros-3.jpg" alt="Fibras de lana natural" />
          </div>
        </div>
      </section>
    </>
  );
}
