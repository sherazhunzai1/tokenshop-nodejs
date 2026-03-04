const { Op } = require('sequelize');
const { Subscription } = require('../models');

async function isSubscribed(subscribeTo, subscriber) {
  if (!subscriber) return false;
  const sub = await Subscription.findOne({
    where: {
      subscriber,
      subscribe_to: subscribeTo,
      end_date: { [Op.gt]: new Date() },
    },
  });
  return !!sub;
}

module.exports = { isSubscribed };
