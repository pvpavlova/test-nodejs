const axios = require("axios");

const logAction = async (shopId, plu, action, date) => {
  try {
    await axios.post("http://localhost:3001/logs", {
      shopId,
      plu,
      action,
      date,
    });
  } catch (err) {
    console.error(
      "Ошибка при отправке данных в историю действий:",
      err.message
    );
  }
};

module.exports = logAction;
