const Ticket = require("./Ticket");

class TicketsList {
  constructor() {
    this.data = [];
  }

  add(name, description) {
    const newTicket = new Ticket(name, description);
    this.data.push(newTicket);
  }

  byId(id) {
    const ticket = this.data.filter((ele) => ele.id === id);
    return ticket;
  }

  changeTicket(id, name, description) {
    const index = this.data.findIndex((item) => item.id === id);
    const ticket = this.data[index];
    ticket.name = name;
    ticket.description = description;
  }

  changeStatus(id, status) {
    const index = this.data.findIndex((item) => item.id === id);
    const ticket = this.data[index];
    ticket.status = status;
  }

  delete(id) {
    const newData = this.data.filter((ele) => ele.id !== id);
    this.data = newData;
  }

  allTickets() {
    return this.data;
  }
}

module.exports = TicketsList;
