'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Categories
    await queryInterface.createTable('categories', {
      cat_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cat_name: { type: Sequelize.STRING(255), allowNull: true },
      cat_description: { type: Sequelize.STRING(255), allowNull: true },
      cat_img: { type: Sequelize.STRING(255), allowNull: true },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // 2. Creators
    await queryInterface.createTable('creators', {
      creatorID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: { type: Sequelize.STRING(255), allowNull: true },
      walletAddress: { type: Sequelize.STRING(255), allowNull: true, unique: true },
      firstName: { type: Sequelize.STRING(255), allowNull: true },
      email: { type: Sequelize.STRING(255), allowNull: true },
      lastName: { type: Sequelize.STRING(255), allowNull: true },
      bio: { type: Sequelize.TEXT('long'), allowNull: true },
      img: { type: Sequelize.STRING(255), allowNull: true },
      cover: { type: Sequelize.STRING(255), defaultValue: 'cover.png' },
      portfolio: { type: Sequelize.STRING(255), allowNull: true },
      instagram: { type: Sequelize.STRING(255), allowNull: true },
      twitter: { type: Sequelize.STRING(255), allowNull: true },
      facebook: { type: Sequelize.STRING(255), allowNull: true },
      subscrption_price: { type: Sequelize.DOUBLE, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
    });

    // 3. NFTs
    await queryInterface.createTable('nfts', {
      nft_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tokenId: { type: Sequelize.INTEGER, allowNull: true },
      title: { type: Sequelize.STRING(255), allowNull: true },
      description: { type: Sequelize.TEXT('long'), allowNull: true },
      image: { type: Sequelize.STRING(255), allowNull: true },
      creatorWallet: { type: Sequelize.STRING(255), allowNull: true },
      ownerWallet: { type: Sequelize.STRING(255), allowNull: true },
      sale: { type: Sequelize.INTEGER, defaultValue: 0 },
      auction: { type: Sequelize.INTEGER, defaultValue: 0 },
      fixedprice: { type: Sequelize.INTEGER, defaultValue: 0 },
      metadata: { type: Sequelize.STRING(255), allowNull: true },
      transactionHash: { type: Sequelize.STRING(255), allowNull: true },
      categoryId: { type: Sequelize.INTEGER, allowNull: true },
      video: { type: Sequelize.STRING(255), allowNull: true },
      socialMediaImage: { type: Sequelize.STRING(255), allowNull: true },
      artistImage: { type: Sequelize.STRING(255), allowNull: true },
      titleImage: { type: Sequelize.STRING(255), allowNull: true },
      nftType: { type: Sequelize.INTEGER, defaultValue: 0 },
      royalityPercentage: { type: Sequelize.DOUBLE, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
    });

    // 4. Fixed Price
    await queryInterface.createTable('fixedprice', {
      saleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: { type: Sequelize.STRING(255), allowNull: true },
      tokenId: { type: Sequelize.INTEGER, allowNull: false },
      transactionHash: { type: Sequelize.STRING(255), allowNull: true },
      owner: { type: Sequelize.STRING(255), allowNull: false },
      price: { type: Sequelize.DOUBLE, allowNull: false },
      onSale: { type: Sequelize.INTEGER, defaultValue: 1 },
      isSold: { type: Sequelize.INTEGER, defaultValue: 0 },
      isCanceled: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
    });

    // 5. Auctions
    await queryInterface.createTable('auctions', {
      auctionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tokenId: { type: Sequelize.INTEGER, allowNull: false },
      owner_address: { type: Sequelize.STRING(255), allowNull: true },
      transactionHash: { type: Sequelize.STRING(255), allowNull: true },
      reservePrice: { type: Sequelize.FLOAT, allowNull: false },
      highestBid: { type: Sequelize.FLOAT, defaultValue: 0 },
      endTimeInSeconds: { type: Sequelize.DOUBLE, allowNull: false },
      isSettled: { type: Sequelize.INTEGER, defaultValue: 0 },
      highestBidder: { type: Sequelize.STRING(255), allowNull: true },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
    });

    // 6. Biddings
    await queryInterface.createTable('biddings', {
      bidding_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      auction_id: { type: Sequelize.INTEGER, allowNull: false },
      bidder_id: { type: Sequelize.STRING(255), allowNull: false },
      price: { type: Sequelize.FLOAT, allowNull: false },
      transferHash: { type: Sequelize.STRING(255), allowNull: false },
      settlement: { type: Sequelize.INTEGER, defaultValue: 0 },
      result: { type: Sequelize.STRING(255), defaultValue: 'pending' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
    });

    // 7. Offers
    await queryInterface.createTable('offers', {
      offerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tokenId: { type: Sequelize.INTEGER, allowNull: false },
      sender_address: { type: Sequelize.STRING(255), allowNull: false },
      reciever_address: { type: Sequelize.STRING(255), allowNull: false },
      offer_price: { type: Sequelize.DOUBLE, allowNull: false },
      status: { type: Sequelize.STRING(50), defaultValue: 'pending' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // 8. Transfer NFT
    await queryInterface.createTable('transfernft', {
      transferId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      transferFrom: { type: Sequelize.STRING(255), allowNull: false },
      transferTo: { type: Sequelize.STRING(255), allowNull: false },
      amount: { type: Sequelize.FLOAT, allowNull: false },
      tokenId: { type: Sequelize.INTEGER, allowNull: false },
      transferType: { type: Sequelize.STRING(255), allowNull: false },
      tranferReferenceId: { type: Sequelize.INTEGER, allowNull: false },
      transferHash: { type: Sequelize.STRING(255), allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // 9. Subscriptions
    await queryInterface.createTable('subscrptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subscriber: { type: Sequelize.STRING(255), allowNull: false },
      subscribe_to: { type: Sequelize.STRING(255), allowNull: false },
      price: { type: Sequelize.DOUBLE, defaultValue: 0 },
      end_date: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
    });

    // 10. Notifications
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      recieverAddress: { type: Sequelize.STRING(255), allowNull: false },
      tokenId: { type: Sequelize.INTEGER, allowNull: false },
      type: { type: Sequelize.STRING(255), allowNull: false },
      offerId: { type: Sequelize.INTEGER, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });

    // 11. Sessions
    await queryInterface.createTable('sessions', {
      session_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: { type: Sequelize.STRING(255), allowNull: false },
      username: { type: Sequelize.STRING(255), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
    });

    // 12. Transactions
    await queryInterface.createTable('transactions', {
      transactonId: {
        type: Sequelize.STRING(255),
        primaryKey: true,
      },
      sendedFrom: { type: Sequelize.STRING(255), allowNull: false },
      recievedTo: { type: Sequelize.STRING(255), allowNull: false },
      amount: { type: Sequelize.DOUBLE, allowNull: false },
      tokenId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('subscrptions');
    await queryInterface.dropTable('transfernft');
    await queryInterface.dropTable('transactions');
    await queryInterface.dropTable('sessions');
    await queryInterface.dropTable('biddings');
    await queryInterface.dropTable('offers');
    await queryInterface.dropTable('auctions');
    await queryInterface.dropTable('fixedprice');
    await queryInterface.dropTable('nfts');
    await queryInterface.dropTable('creators');
    await queryInterface.dropTable('categories');
  },
};
