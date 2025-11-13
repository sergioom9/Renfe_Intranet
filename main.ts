import { App, staticFiles } from "fresh";
import { define, type State } from "./utils.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import dotenv from "dotenv";

export const app = new App<State>();
dotenv.config();
app.use(staticFiles());

const adminmail = Deno.env.get("EMAIL") || "default@default.com";
const adminpass = Deno.env.get("PASSWORD") || "default";
app.post("/api/login", async (ctx) => {
  try {
    const formData = await ctx.req.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/?error=emptyfields" },
      });
    }
    if (email != adminmail || password != adminpass) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/?error=credentials" },
      });
    }
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/dashboard",
        "Set-Cookie": "auth=admin-token; Path=/",
      },
    });
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/?error=server" },
    });
  }
});

app.get("/api/news", async () => {
  try {
    const apiResponse = await fetch(
      "https://backend-renfe.sergioom9.deno.net/news",
    );
    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/tickets" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/tickets" },
    });
  }
});
app.post("/api/news", async (ctx) => {
  try {
    const { newid, title, content, date, image } = await ctx.req.json();

    const cookie = ctx.req.headers.get("cookie") || "";
    const match = cookie.match(/auth=([^;]+)/);
    const token = match?.[1];

    if (!(newid && title && date && content && image)) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/news" },
      });
    }
    const apiResponse = await fetch(
      "https://backend-renfe.sergioom9.deno.net/news/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify({ newid, title, content, date, image }),
      },
    );

    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/news" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/news" },
    });
  }
});
app.put("/api/news", async (ctx) => {
  try {
    const { newid, title, content, date, image } = await ctx.req.json();

    const cookie = ctx.req.headers.get("cookie") || "";
    const match = cookie.match(/auth=([^;]+)/);
    const token = match?.[1];
    if (!(newid && title && date && content && image)) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/news" },
      });
    }
    const apiResponse = await fetch(
      "https://backend-renfe.sergioom9.deno.net/news",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify({ newid, title, content, date, image }),
      },
    );

    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/news" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/news" },
    });
  }
});
app.delete("/api/news", async (ctx) => {
  try {
    const { newid } = await ctx.req.json();

    const cookie = ctx.req.headers.get("cookie") || "";
    const match = cookie.match(/auth=([^;]+)/);
    const token = match?.[1];

    if (!newid) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/news" },
      });
    }
    const apiResponse = await fetch(
      `https://backend-renfe.sergioom9.deno.net/news/${newid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
      },
    );

    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/news" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/news" },
    });
  }
});

app.get("/api/tickets", async (ctx) => {
  try {
    const cookie = ctx.req.headers.get("cookie") || "";
    const match = cookie.match(/auth=([^;]+)/);
    const token = match?.[1];
    const apiResponse = await fetch(
      "https://backend-renfe.sergioom9.deno.net/ticket",{
      headers: {Authorization:`${token}`}}
    );
    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/tickets" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/tickets" },
    });
  }
});
app.put("/api/tickets", async (ctx) => {
  try {
    const { ticketid, origin, destination, date, price } = await ctx.req.json();

    const cookie = ctx.req.headers.get("cookie") || "";
    const match = cookie.match(/auth=([^;]+)/);
    const token = match?.[1];
    if (!(ticketid && origin && destination && date && price)) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/tickets" },
      });
    }
    const apiResponse = await fetch(
      "https://backend-renfe.sergioom9.deno.net/ticket",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify({ ticketid, origin, destination, price, date }),
      },
    );

    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/tickets" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/tickets" },
    });
  }
});
app.delete("/api/tickets", async (ctx) => {
  try {
    const { ticketid } = await ctx.req.json();

    const cookie = ctx.req.headers.get("cookie") || "";
    const match = cookie.match(/auth=([^;]+)/);
    const token = match?.[1];

    if (!ticketid) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/tickets" },
      });
    }
    const apiResponse = await fetch(
      `https://backend-renfe.sergioom9.deno.net/ticket/${ticketid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
      },
    );

    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/tickets" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/tickets" },
    });
  }
});
app.post("/api/tickets", async (ctx) => {
  try {
    const { ticketid, origin, destination, date, price } = await ctx.req.json();

    const cookie = ctx.req.headers.get("cookie") || "";
    const match = cookie.match(/auth=([^;]+)/);
    const token = match?.[1];

    if (!(ticketid && origin && destination && date && price)) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/tickets" },
      });
    }
    const apiResponse = await fetch(
      "https://backend-renfe.sergioom9.deno.net/ticket/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify({ ticketid, origin, destination, price, date }),
      },
    );

    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/tickets" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/tickets" },
    });
  }
});

app.get("/api/users", async (ctx) => {
  try {
    const cookie = ctx.req.headers.get("cookie") || "";
    const match = cookie.match(/auth=([^;]+)/);
    const token = match?.[1];
    const apiResponse = await fetch(
      "https://backend-renfe.sergioom9.deno.net/user",
      {
        method: "GET",
        headers: {
          "Authorization": `${token}`,
        },
      },
    );
    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/user" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/user" },
    });
  }
});
app.put("/api/users", async (ctx) => {
  try {
    const { userid, name, email, password, coins } = await ctx.req.json();

    const cookie = ctx.req.headers.get("cookie") || "";
    const match = cookie.match(/auth=([^;]+)/);
    const token = match?.[1];
    if (!(userid && name && email && password && coins)) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/user" },
      });
    }
    const apiResponse = await fetch(
      "https://backend-renfe.sergioom9.deno.net/user",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify({ userid, name, email, password, coins }),
      },
    );

    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/user" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/user" },
    });
  }
});
app.delete("/api/users", async (ctx) => {
  try {
    const { userid } = await ctx.req.json();
    const cookie = ctx.req.headers.get("cookie") || "";
    const match = cookie.match(/auth=([^;]+)/);
    const token = match?.[1];

    if (!userid) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/user" },
      });
    }
    const apiResponse = await fetch(
      `https://backend-renfe.sergioom9.deno.net/user/${userid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
      },
    );

    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/user" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/user" },
    });
  }
});
app.post("/api/users", async (ctx) => {
  try {
    const { userid, name, email, password, coins } = await ctx.req.json();

    const cookie = ctx.req.headers.get("cookie") || "";
    const match = cookie.match(/auth=([^;]+)/);
    const token = match?.[1];
    if (!(userid && name && email && password && coins)) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/user" },
      });
    }
    const apiResponse = await fetch(
      "https://backend-renfe.sergioom9.deno.net/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify({ userid, name, email, password, coins }),
      },
    );

    if (!apiResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/user" },
      });
    }
    const result = await apiResponse.json();
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/user" },
    });
  }
});

app.post("/api/hash", async (ctx) => {
  try {
    const { hash, pass} = await ctx.req.json();


    if (!(hash && pass)) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/user" },
      });
    }
    const equals = await bcrypt.compare(pass, hash);

    if (!equals) {
      return new Response(null, {
        status: 401
      });
    }
    return new Response(null,
      { status: 200},
    );
  } catch (_error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/user" },
    });
  }
});

app.get("/api/logout", () => {
  return new Response(null, {
    status: 302,
    headers: {
      "Set-Cookie": "auth=; Path=/; Max-Age=0", 
      "Location": "/", 
    },
  });
});

const checkAuth = define.middleware(async (ctx) => {
  const cookie = ctx.req.headers.get("cookie") || "";
  const match = cookie.match(/auth=([^;]+)/);
  const token = match?.[1];
  if (token != "admin-token") {
    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  }
  return await ctx.next();
});
const alreadylogged = define.middleware(async (ctx) => {
  const cookie = ctx.req.headers.get("cookie") || "";
  const match = cookie.match(/auth=([^;]+)/);
  const token = match?.[1];
  if (token == "admin-token") {
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard" },
    });
  }
  return await ctx.next();
});
app.use("/(main)", checkAuth);
app.use("/(index)", alreadylogged);

app.fsRoutes();
