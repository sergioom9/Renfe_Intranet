import { useEffect, useState } from "preact/hooks";
import Loading from "./Loading.tsx";

type User = {
  userid: string;
  name: string;
  email: string;
  password: string;
  coins: string;
};

export default function UserComponent() {
  const [Users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [updateform, setUpdateform] = useState<Partial<User>>({});
  const [createform, setCreateform] = useState<Partial<User>>({});

  useEffect(() => {
    setLoading(true);
    cargarUsers();
  }, []);

  const cargarUsers = async () => {
    try {
      const res = await fetch(
        "/api/users",
      );
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando noticias:", error);
    }
  };

  const actualizarUser = async () => {
    const url = "/api/users";
    try {
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateform),
      });
      await cargarUsers();
      setEditingId(null);
      setUpdateform({});
    } catch (error) {
      console.error("Error actualizando noticia:", error);
    }
  };

  const crearUser = async () => {
    const url = "/api/users";
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createform),
      });
      await cargarUsers();
      setShowCreateForm(false);
      setCreateform({});
    } catch (error) {
      console.error("Error creando noticia:", error);
    }
  };

  const eliminarUser = async (id: string) => {
    if (!confirm("¿Estás seguro?")) return;

    try {
      await fetch(`/api/users`, {
        method: "DELETE",
        body: JSON.stringify({ userid: id }),
      });
      await cargarUsers();
    } catch (error) {
      console.error("Error eliminando noticia:", error);
    }
  };

  const iniciarEdicion = (user: User) => {
    setEditingId(user.userid);
    setUpdateform({ ...user });
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setUpdateform({});
  };

  const comprobarPassword = async (hash: string) => {
    const pass = prompt("Introduce la contraseña en texto plano:");
    if (!pass) return;
    try {
      const resapi = await fetch(`/api/hash`, {
        method: "POST",
        body: JSON.stringify({ pass, hash }),
      });
      if (!resapi.ok) {
        alert("❌ Contraseña incorrecta");
        return
      }
      alert("✅ Contraseña correcta");
    } catch (_e) {
      alert("Error verificando la contraseña");
    }
  };

  if (loading) return <Loading />;
  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <button
          style="margin-right: 20px;"
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancelar" : "+ Nuevo Usuario"}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => globalThis.location.href = "/dashboard"}
        >
          Atras
        </button>
      </div>

      {showCreateForm && (
        <div className="form-container">
          <h2>Crear Nuevo Usuario</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>ID</label>
              <input
                type="text"
                value={createform.userid || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    userid: (e.target as HTMLInputElement).value,
                  })}
              />
            </div>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={createform.name || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    name: (e.target as HTMLInputElement).value,
                  })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                value={createform.email || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    email: (e.target as HTMLInputElement).value,
                  })}
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="text"
                value={createform.password || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    password: (e.target as HTMLInputElement).value,
                  })}
              />
              <div className="form-actions">
                <button
                  className="btn btn-cancel"
                  onClick={() => {
                    setShowCreateForm(false);
                    setCreateform({});
                  }}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={crearUser}>
                  Crear Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Contraseña</th>
              <th>Monedas</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {Users && Users.map((Users: User) => (
              <>
                <tr key={Users.userid}>
                  <td>{Users.userid}</td>
                  <td>{Users.name}</td>
                  <td>{Users.email}</td>
                  <td>
                    <div>
                      {Users.password}{" "}
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => comprobarPassword(Users.password)}
                      >
                        Comprobar
                      </button>
                    </div>
                  </td>
                  <td>{Users.coins}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => iniciarEdicion(Users)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarUser(Users.userid)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>

                {editingId === Users.userid && (
                  <tr className="edit-row">
                    <td colSpan={9}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>ID</label>
                          <input
                            type="text"
                            value={updateform.userid || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                userid: (e.target as HTMLInputElement).value,
                              })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            value={updateform.name || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                name: (e.target as HTMLInputElement).value,
                              })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="text"
                            value={updateform.email || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                email: (e.target as HTMLInputElement).value,
                              })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Contraseña</label>
                          <input
                            type="text"
                            value={updateform.password || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                password: (e.target as HTMLInputElement).value,
                              })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Monedas</label>
                          <input
                            type="text"
                            value={updateform.coins || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                coins: (e.target as HTMLInputElement).value,
                              })}
                          />
                        </div>
                        <div className="form-actions">
                          <button
                            className="btn btn-cancel"
                            onClick={cancelarEdicion}
                          >
                            Cancelar
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={actualizarUser}
                          >
                            Guardar Cambios
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
