'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable('creators');
    if (!tableDesc.subscrption_price) {
      await queryInterface.addColumn('creators', 'subscrption_price', {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      });
    }
  },

  async down(queryInterface) {
    const tableDesc = await queryInterface.describeTable('creators');
    if (tableDesc.subscrption_price) {
      await queryInterface.removeColumn('creators', 'subscrption_price');
    }
  },
};
