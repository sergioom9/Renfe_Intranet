import { useEffect, useState } from "preact/hooks";
import Loading from "./Loading.tsx";

type New = {
  newid: string;
  title: string;
  image: string;
  content: string;
  date: string;
};

export default function NewComponent() {
  const [news, setNews] = useState<New[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [updateform, setUpdateform] = useState<Partial<New>>({});
  const [createform, setCreateform] = useState<Partial<New>>({});

  useEffect(() => {
    setLoading(true);
    cargarNews();
  }, []);

  const cargarNews = async () => {
    try {
      const res = await fetch(
        "/api/news",
      );
      const data = await res.json();
      setNews(data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando noticias:", error);
    }
  };

  const actualizarNew = async () => {
    const url = "/api/news";
    try {
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateform),
      });
      await cargarNews();
      setEditingId(null);
      setUpdateform({});
    } catch (error) {
      console.error("Error actualizando noticia:", error);
    }
  };

  const crearNew = async () => {
    const url = "/api/news";
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createform),
      });
      await cargarNews();
      setShowCreateForm(false);
      setCreateform({});
    } catch (error) {
      console.error("Error creando noticia:", error);
    }
  };

  const eliminarNew = async (id: string) => {
    if (!confirm("¿Estás seguro?")) return;

    try {
      await fetch(`/api/news`, {
        method: "DELETE",
        body: JSON.stringify({ newid: id }),
      });
      await cargarNews();
    } catch (error) {
      console.error("Error eliminando noticia:", error);
    }
  };

  const iniciarEdicion = (noticia: New) => {
    setEditingId(noticia.newid);
    setUpdateform({ ...noticia });
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setUpdateform({});
  };
  if (loading){return <Loading />;}
  return (
    
    <div>
      <div className="page-header">
        <h1>Gestión de Noticias</h1>
        <button
        style="margin-right: 20px;"
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancelar" : "+ Nueva Noticia"}
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
          <h2>Crear Nueva Noticia</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>ID</label>
              <input
                type="text"
                value={createform.newid || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    newid: (e.target as HTMLInputElement).value,
                  })}
              />
            </div>
            <div className="form-group">
              <label>Titulo</label>
              <input
                type="text"
                value={createform.title || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    title: (e.target as HTMLInputElement).value,
                  })}
              />
            </div>
            <div className="form-group">
              <label>Imagen</label>
              <input
                type="text"
                value={createform.image || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    image: (e.target as HTMLInputElement).value,
                  })}
              />
            </div>
            <div className="form-group">
              <label>Contenido</label>
              <input
                type="text"
                value={createform.content || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    content: (e.target as HTMLInputElement).value,
                  })}
              />
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input
                type="datetime-local"
                value={createform.date || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    date: (e.target as HTMLInputElement).value,
                  })}
              />
            </div>
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
              <button className="btn btn-primary" onClick={crearNew}>
                Crear Noticia
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titutlo</th>
              <th>Imagen</th>
              <th>Contenido</th>
              <th>Fecha</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {news && news.map((news: New) => (
              <>
                <tr key={news.newid}>
                  <td>{news.newid}</td>
                  <td>{news.title}</td>
                  <td><img style="max-width:100px" src={news.image} /></td>
                  <td>{news.content}</td>
                  <td>{new Date(news.date).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => iniciarEdicion(news)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarNew(news.newid)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>

                {editingId === news.newid && (
                  <tr className="edit-row">
                    <td colSpan={9}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Titulo</label>
                          <input
                            type="text"
                            value={updateform.title || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                title: (e.target as HTMLInputElement).value,
                              })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Imagen</label>
                          <input
                            type="text"
                            value={updateform.image || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                image: (e.target as HTMLInputElement).value,
                              })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Contenido</label>
                          <input
                            type="text"
                            value={updateform.content || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                content: (e.target as HTMLInputElement).value,
                              })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Fecha</label>
                          <input
                            type="datetime-local"
                            value={updateform.date || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                date: (e.target as HTMLInputElement).value,
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
                            onClick={actualizarNew}
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
