const { deleteItem } = require("../db/db");

module.exports = message => {
    return deleteItem(message.id)
};
