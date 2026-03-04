const { Op } = require('sequelize');
const { Nft, Category, Creator, FixedPrice, Auction, Subscription } = require('../models');
const { getPagination, getTotalPages } = require('../utils/pagination');
const { getNftIncludes, formatNftResponse, formatSingleArtResponse, formatWalletArtResponse } = require('../utils/nftQuery');
const { isSubscribed } = require('../utils/subscription');
const asyncHandler = require('../utils/asyncHandler');

const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.findAll();
  if (categories.length === 0) {
    return next({ code: 404, message: 'no data found' });
  }

  const categoriesData = categories.map((c) => ({
    categoryId: c.cat_id,
    categoryName: c.cat_name,
    categoryDescription: c.cat_description,
    categoryImage: c.cat_img,
    createdAt: c.createdAt,
  }));

  return res.status(201).json({ categoriesData });
});

const fetchAllNfts = asyncHandler(async (req, res, next) => {
  const { offset, limit, page } = getPagination(req.query.pageNo);

  const { count, rows } = await Nft.findAndCountAll({
    include: getNftIncludes(),
    order: [['created_at', 'DESC']],
    offset,
    limit,
    subQuery: false,
  });

  if (rows.length === 0) {
    return next({ code: 404, message: 'no data found' });
  }

  const totalPages = getTotalPages(count);
  const nftData = rows.map(formatNftResponse);

  return res.status(201).json({ totalPages, currentPage: page, nftData });
});

const getAllNftsData = asyncHandler(async (req, res, next) => {
  const { user, catId: categoryId, search } = req.query;
  const { offset, limit, page } = getPagination(req.query.pageNo);

  const where = { status: 1 };
  if (categoryId) where.categoryId = categoryId;
  if (search) where.title = { [Op.like]: `%${search}%` };

  const { count, rows } = await Nft.findAndCountAll({
    where,
    include: getNftIncludes(),
    order: [['created_at', 'DESC']],
    offset,
    limit,
    subQuery: false,
  });

  if (rows.length === 0) {
    return next({ code: 404, message: 'no data found' });
  }

  const totalPages = getTotalPages(count);

  const nftData = await Promise.all(
    rows.map(async (nft) => {
      const plain = nft.get({ plain: true });
      let subscribed = false;
      let video = false;

      if (user) {
        subscribed = await isSubscribed(plain.ownerWallet, user);
      }
      if (plain.nftType === 1 || subscribed) {
        video = plain.video;
      }

      const formatted = formatNftResponse(nft);
      return {
        ...formatted,
        subscribe: subscribed,
        video,
        explicityContent: plain.nftType,
      };
    })
  );

  return res.status(201).json({ totalPages, currentPage: page, nftData });
});

const fetchAllNftsWithCatId = asyncHandler(async (req, res, next) => {
  const catId = req.params.id;
  const { offset, limit, page } = getPagination(req.query.pageNo);

  const where = { categoryId: catId };

  const { count, rows } = await Nft.findAndCountAll({
    where,
    include: getNftIncludes(),
    offset,
    limit,
    subQuery: false,
  });

  if (rows.length === 0) {
    return next({ code: 404, message: 'no data found' });
  }

  const totalPages = getTotalPages(count);
  const nftData = rows.map(formatNftResponse);

  return res.status(201).json({ totalPages, currentPage: page, nftData });
});

const getSingleArt = asyncHandler(async (req, res, next) => {
  const tokenId = req.query.id;
  const { user } = req.query;

  const nft = await Nft.findOne({
    where: { nft_id: tokenId },
    include: getNftIncludes(),
  });

  if (!nft) {
    return next({ code: 404, message: 'no data found' });
  }

  const plain = nft.get({ plain: true });
  let subscribed = false;

  if (user === plain.ownerWallet) {
    subscribed = true;
  } else if (user) {
    subscribed = await isSubscribed(plain.ownerWallet, user);
  }

  let video = false;
  if (plain.nftType === 1 || subscribed) {
    video = plain.video;
  }

  const data = formatSingleArtResponse(nft);
  data.video = video;

  return res.status(201).json(data);
});

const getFeeds = asyncHandler(async (req, res, next) => {
  const { wallet } = req.params;

  const subscriptions = await Subscription.findAll({
    where: {
      subscriber: wallet,
      end_date: { [Op.gt]: new Date() },
    },
  });

  if (subscriptions.length === 0) {
    return next({ code: 404, message: 'no data found' });
  }

  const subscribedWallets = subscriptions.map((s) => s.subscribe_to);

  const nfts = await Nft.findAll({
    where: { ownerWallet: { [Op.in]: subscribedWallets } },
    include: getNftIncludes(),
    order: [['created_at', 'DESC']],
    subQuery: false,
  });

  const nftData = nfts.map((nft) => {
    const plain = nft.get({ plain: true });
    const formatted = formatNftResponse(nft);
    return {
      ...formatted,
      video: plain.video,
      subscribe: true,
      explicityContent: plain.nftType,
    };
  });

  return res.status(201).json({ nftData });
});

const inWalletArts = asyncHandler(async (req, res, next) => {
  const { walletAddress } = req.params;
  const { user } = req.query;

  if (!walletAddress) {
    return next({ code: 400, message: 'No Wallet Address' });
  }

  let subscribed = false;
  if (user) {
    subscribed = await isSubscribed(walletAddress, user);
  }

  const walletIncludes = [
    { model: Category, as: 'category', attributes: ['cat_id', 'cat_name', 'cat_description', 'cat_img'] },
    { model: Creator, as: 'creator', attributes: ['creatorID', 'walletAddress', 'username', 'img'] },
    { model: Creator, as: 'owner', attributes: ['creatorID', 'walletAddress', 'username', 'img'] },
  ];

  const [createdNfts, collectedNfts] = await Promise.all([
    Nft.findAll({ where: { creatorWallet: walletAddress }, include: walletIncludes }),
    Nft.findAll({
      where: {
        ownerWallet: walletAddress,
        creatorWallet: { [Op.ne]: walletAddress },
      },
      include: walletIncludes,
    }),
  ]);

  const mapArts = (nfts) =>
    nfts.map((nft) => {
      const plain = nft.get({ plain: true });
      const isOwner = user === plain.ownerWallet;
      let video = false;
      if (plain.nftType === 1 || subscribed || isOwner) {
        video = plain.video;
      }
      const formatted = formatWalletArtResponse(nft);
      formatted.video = video;
      return formatted;
    });

  return res.status(201).json({
    createdArts: mapArts(createdNfts),
    collectedArts: mapArts(collectedNfts),
  });
});

const mintArt = asyncHandler(async (req, res, next) => {
  const payload = req.body;
  if (!payload) {
    return next({ code: 400, message: 'No Request Found' });
  }

  await Nft.create({
    tokenId: payload.tokenId,
    title: payload.title,
    description: payload.description,
    image: payload.image,
    creatorWallet: payload.creatorWallet,
    ownerWallet: payload.creatorWallet,
    sale: 1,
    transactionHash: payload.transactionHash,
    categoryId: payload.categoryId,
    video: payload.video,
    socialMediaImage: payload.socialImage,
    artistImage: payload.artistImage,
    titleImage: payload.titleImage,
    nftType: payload.explicityContent,
    royalityPercentage: payload.royalityPercentage,
  });

  return res.status(201).json({ message: ' Minted Successfully', tokenId: payload.tokenId });
});

module.exports = {
  getAllCategories,
  fetchAllNfts,
  getAllNftsData,
  fetchAllNftsWithCatId,
  getSingleArt,
  getFeeds,
  inWalletArts,
  mintArt,
};
