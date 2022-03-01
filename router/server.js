const http = require('http');
const fs = require("fs");
const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body');

const app = new Koa();
const port = process.env.PORT || 7070;

const public = path.join(__dirname, '/public');

let tickets = [{
  "id": "1",
  "name": "Поменять краску",
  "status": "false",
  "description": "Принтер HP LJ 1210",
  "created": "06.06.15 10:25"
},

{
  "id": "2",
  "name": "Установить обновление",
  "status": "true",
  "description": "Обновление KB-XXXX c родного сервера",
  "created": "06.06.15 12:25"
}];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');  

  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };
  
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }
  
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
  
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
    }
  
    ctx.response.status = 204;
  }
});

app.use(async (ctx) => { 
  const { method } = ctx.request.query;
  const reqType = ctx.request.method;

  if(reqType === 'GET' && method === 'allTicket') {
    ctx.response.body = tickets;
    return;
  }

  if (reqType === 'POST') {
    tickets.push(ctx.request.body);
    ctx.response.body = 'New ticket was added!';
    return
  }

  if (reqType === 'PATCH') {
    const { id, method, name, description, status } = ctx.request.body;
    
    if (method === 'deleteTicket') {
      tickets = tickets.filter((ticket) => ticket.id !== id);
      ctx.response.body = 'Ticket was deleted!';
      return
    }

    if (method === 'editTicket') {
      const filtered = tickets.filter((ticket) => ticket.id === id)[0];      
      filtered.name = name;
      filtered.description = description;      
      
      ctx.response.body = {text: 'Ticket was edited!', data: filtered};
      return
    }

    if (method === 'checkTicket') {
      const filtered = tickets.filter((ticket) => ticket.id === id)[0];      
      
      filtered.status = JSON.parse(status);
      
      ctx.response.body = filtered.status;
      return
    }     
  }
});

const server = http.createServer(app.callback()).listen(port);
