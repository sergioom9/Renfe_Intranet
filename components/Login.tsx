import { useEffect, useState } from "preact/hooks";

export default function LoginComponent() {
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(globalThis.location.search);
    const errorParam = params.get("error");
    switch (errorParam) {
      case "credentials":
        setError("Usuario o contraseña incorrectos");
        break;
      case "emptyfields":
        setError("Completa todos los campos");
        break;
      case "server":
        setError("Error del servidor");
        break;
    }
  }, []);

  return (
    <div class="login-container" style="display: flex; justify-content: center;">
      <div class="login-box">
        <img style="max-width:200px" src="https://cdn-icons-png.flaticon.com/512/8439/8439392.png" /> 
        <h1>IntraNet</h1>
        {error && <div class="error-box">{error}</div>}
        <form method="POST" action="/api/login">
          <div class="form-group">
            <label for="email">Email</label>
            <input style="max-width:300px"
              type="email"
              id="email"
              name="email"
              required
              placeholder="admin@trenfe.com"
            />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input style="max-width:300px"
              type="password"
              id="password"
              name="password"
              required
              placeholder="trenfeadmin1"
            />
          </div>
          <button type="submit" class="btn btn-primary">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
