export default function BrandFrame({ title, children }) {
  return (
    <section className="panel">
      <header className="panel-header">
        <h2>{title}</h2>
        <p className="brand-name">MuhammadSaad</p>
      </header>
      <div className="panel-body">{children}</div>
      <footer className="panel-footer">Built by MuhammadSaad</footer>
    </section>
  );
}
