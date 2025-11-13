export default function Dashboard() {
  return (
    <div>
      <nav class="navbar">
        <div class="nav-brand">Intranet</div>
        <div class="nav-links">
          <a href="/user">Usuarios</a>
          <a href="/news">Noticias</a>
          <a href="/tickets">Tickets</a>
          <a href="/api/logout">
            Cerrar Sesión
          </a>
        </div>
      </nav>
      <div class="container">
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h2>Usuarios</h2>
            <p>Gestiona los usuarios del sistema</p>
            <a href="/user" class="btn btn-primary">Ir a Usuarios</a>
          </div>
          <div class="dashboard-card">
            <h2>Noticias</h2>
            <p>Administra las noticias de la intranet</p>
            <a href="/news" class="btn btn-primary">Ir a Noticias</a>
          </div>
          <div class="dashboard-card">
            <h2>Tickets</h2>
            <p>Gestiona los tickets de soporte</p>
            <a href="/tickets" class="btn btn-primary">Ir a Tickets</a>
          </div>
        </div>
      </div>
    </div>
  );
}
