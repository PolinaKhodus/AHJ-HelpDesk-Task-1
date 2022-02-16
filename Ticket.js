/* eslint-disable linebreak-style */
const { v4: uuidv4 } = require("uuid");

class Ticket {
  constructor(name, description) {
    this.id = uuidv4(); // идентификатор (уникальный в пределах системы)
    this.name = name;// краткое описание
    this.description = description;// полное описание
    this.status = false;// boolean - сделано или нет
    this.created = new Date().toLocaleString();// дата создания (timestamp)
  }
}
module.exports = Ticket;
