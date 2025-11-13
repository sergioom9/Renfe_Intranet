import { useEffect, useState } from "preact/hooks";
import Loading from "./Loading.tsx";
type Ticket = {
  ticketid: string;
  userid?: string;
  origin: string;
  destination: string;
  date: string;
  price: string;
  coinsGained?: string;
  vendido?: boolean;
};

export default function TicketsComponent() {
  const [loading, setLoading] = useState<boolean>(false);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [updateform, setUpdateform] = useState<Partial<Ticket>>({});
  const [createform, setCreateform] = useState<Partial<Ticket>>({});

  useEffect(() => {
    setLoading(true);
    cargarTickets();
  }, []);

  const cargarTickets = async () => {
    try {
      const res = await fetch(
        "/api/tickets",
      );
      const data = await res.json();
      setTickets(data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando tickets:", error);
    }
  };

  const actualizarTicket = async () => {
    const url = "/api/tickets";
    try {
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateform),
      });
      await cargarTickets();
      setEditingId(null);
      setUpdateform({});
    } catch (error) {
      console.error("Error actualizando ticket:", error);
    }
  };

  const crearTicket = async () => {
    const url = "/api/tickets";
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createform),
      });
      await cargarTickets();
      setShowCreateForm(false);
      setCreateform({});
    } catch (error) {
      console.error("Error creando ticket:", error);
    }
  };

  const eliminarTicket = async (id: string) => {
    if (!confirm("¿Estás seguro?")) return;

    try {
      await fetch(`/api/tickets`, {
        method: "DELETE",
        body: JSON.stringify({ ticketid: id }),
      });
      await cargarTickets();
    } catch (error) {
      console.error("Error eliminando ticket:", error);
    }
  };

  const iniciarEdicion = (ticket: Ticket) => {
    setEditingId(ticket.ticketid);
    setUpdateform({ ...ticket });
  };

  const cancelarEdicion = () => {
    setEditingId(null);
    setUpdateform({});
  };
if (loading){return <Loading />;}
  return (
    <div>
      <div className="page-header">
        <h1>Gestión de Tickets</h1>
        <button
        style="margin-right: 20px;"
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancelar" : "+ Nuevo Ticket"}
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
          <h2>Crear Nuevo Ticket</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>ID</label>
              <input
                type="text"
                value={createform.ticketid || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    ticketid: (e.target as HTMLInputElement).value,
                  })}
              />
            </div>
            <div className="form-group">
              <label>Origen</label>
              <input
                type="text"
                value={createform.origin || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    origin: (e.target as HTMLInputElement).value,
                  })}
              />
            </div>
            <div className="form-group">
              <label>Destino</label>
              <input
                type="text"
                value={createform.destination || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    destination: (e.target as HTMLInputElement).value,
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
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                step="0.01"
                value={createform.price || ""}
                onChange={(e) =>
                  setCreateform({
                    ...createform,
                    price: (e.target as HTMLInputElement).value,
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
              <button className="btn btn-primary" onClick={crearTicket}>
                Crear Ticket
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
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha</th>
              <th>Precio</th>
              <th>Vendido</th>
              <th>Comprador</th>
              <th>Monedas</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets && tickets.map((ticket: Ticket) => (
              <>
                <tr key={ticket.ticketid}>
                  <td>{ticket.ticketid}</td>
                  <td>{ticket.origin}</td>
                  <td>{ticket.destination}</td>
                  <td>{new Date(ticket.date).toLocaleString()}</td>
                  <td>{ticket.price}€</td>
                  <td>{ticket.vendido ? "✅" : "❌"}</td>
                  <td>{ticket.vendido ? ticket.userid : "-"}</td>
                  <td>{ticket.vendido ? ticket.coinsGained : "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => iniciarEdicion(ticket)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarTicket(ticket.ticketid)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>

                {editingId === ticket.ticketid && (
                  <tr className="edit-row">
                    <td colSpan={9}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Origen</label>
                          <input
                            type="text"
                            value={updateform.origin || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                origin: (e.target as HTMLInputElement).value,
                              })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Destino</label>
                          <input
                            type="text"
                            value={updateform.destination || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                destination:
                                  (e.target as HTMLInputElement).value,
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
                        <div className="form-group">
                          <label>Precio</label>
                          <input
                            type="number"
                            step="0.01"
                            value={updateform.price || ""}
                            onChange={(e) =>
                              setUpdateform({
                                ...updateform,
                                price: (e.target as HTMLInputElement).value,
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
                            onClick={actualizarTicket}
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
