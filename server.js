/* eslint-disable no-return-await */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const http = require("http");
const Koa = require("koa");
const koaBody = require("koa-body");
const TicketsList = require("./TicketsList");

const app = new Koa();
const ticketsList = new TicketsList();
ticketsList.add("First", "Sample for testing");
ticketsList.add("Second", "Sample for testing two");

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
  text: true,
}));

app.use(async (ctx, next) => {
  const origin = ctx.request.get("Origin");
  if (!origin) {
    return await next();
  }
  const headers = { "Access-Control-Allow-Origin": "*" };

  if (ctx.request.method !== "OPTIONS") {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get("Access-Control-Request-Method")) {
    ctx.response.set({
      ...headers,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
    });

    if (ctx.request.get("Access-Control-Request-Headers")) {
      ctx.response.set("Access-Control-Allow-Headers", ctx.request.get("Access-Control-Request-Headers"));
    }
    ctx.response.status = 204;
  }
});

app.use(async (ctx) => {
  const { method } = ctx.request.query;
  if (ctx.request.method === "GET") {
    switch (method) {
      case "allTickets": {
        const allTickets = ticketsList.data.map((item) => ({
          id: item.id,
          name: item.name,
          status: item.status,
          created: item.created,
        }));
        ctx.response.body = allTickets;
        break;
      }

      case "ticketById": {
        const { id } = ctx.request.query;
        ctx.response.body = ticketsList.byId(id);
        break;
      }

      case "createTicket": {
        const { name, description } = ctx.request.query;
        ticketsList.add(name, description);
        ctx.response.body = ticketsList;
        break;
      }

      default: {
        ctx.response.status = 404;
      }
    }
  }

  if (ctx.request.method === "POST") {
    const { name, description } = ctx.request.body;
    ticketsList.add(name, description);
    ctx.response.body = "New ticket added.";
  }

  if (ctx.request.method === "PUT") {
    const { id, name, description } = ctx.request.body;
    ticketsList.changeTicket(id, name, description);
    ctx.response.body = "Ticket changed.";
  }

  if (ctx.method === "DELETE") {
    const { id } = ctx.request.query;
    ticketsList.delete(id);
    ctx.response.body = "ok";
  }

  if (ctx.method === "PATCH") {
    const { id, status } = ctx.request.query;
    ticketsList.changeStatus(id, status);
    ctx.response.body = "Status changed.";
  }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
