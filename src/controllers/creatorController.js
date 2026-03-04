const Joi = require('joi');
const { Creator, Subscription } = require('../models');
const { isSubscribed } = require('../utils/subscription');
const { getPagination, getTotalPages } = require('../utils/pagination');
const asyncHandler = require('../utils/asyncHandler');
const sequelize = require('../config/database');

const checkEmail = asyncHandler(async (req, res, next) => {
  const existing = await Creator.findOne({ where: { email: req.params.email } });
  if (existing) {
    return res.status(409).json({ emailAvailable: false });
  }
  return res.status(200).json({ emailAvailable: true });
});

const checkWallet = asyncHandler(async (req, res, next) => {
  const existing = await Creator.findOne({ where: { walletAddress: req.params.wallet } });
  if (existing) {
    return res.status(409).json({ walletAvailable: false });
  }
  return res.status(200).json({ walletAvailable: true });
});

const checkUserName = asyncHandler(async (req, res, next) => {
  const existing = await Creator.findOne({ where: { username: req.params.username } });
  if (existing) {
    return res.status(409).json({ userNameAvailable: false });
  }
  return res.status(200).json({ userNameAvailable: true });
});

const signUp = asyncHandler(async (req, res, next) => {
  const { walletAddress } = req.params;
  if (!walletAddress) {
    return next({ code: 400, message: 'No Request Found' });
  }
  await Creator.create({ walletAddress, username: walletAddress });
  return res.status(201).json({ message: ' Registered Successfully' });
});

const userLogin = asyncHandler(async (req, res, next) => {
  const { wallet } = req.body;
  const schema = Joi.object({
    wallet: Joi.string().required().pattern(/^0x[a-fA-F0-9]{40}$/),
  }).options({ abortEarly: false, allowUnknown: false });

  const { error } = schema.validate({ wallet });
  if (error) {
    return res.status(401).json('invalid wallet');
  }

  let creator = await Creator.findOne({ where: { walletAddress: wallet } });
  if (!creator) {
    await Creator.create({ walletAddress: wallet, username: wallet });
    creator = await Creator.findOne({ where: { walletAddress: wallet } });
  }
  return res.status(201).json(creator);
});

const checkSession = asyncHandler(async (req, res, next) => {
  const { wallet } = req.query;
  if (!wallet) {
    return next({ code: 400, message: 'No Request Found' });
  }
  const creator = await Creator.findOne({ where: { walletAddress: wallet } });
  if (!creator) {
    return next({ code: 404, message: 'user not found' });
  }
  return res.status(200).json({ userInfo: creator });
});

const allCreators = asyncHandler(async (req, res, next) => {
  const { offset, limit, page } = getPagination(req.query.pageNo);

  const { count, rows } = await Creator.findAndCountAll({
    offset,
    limit,
    order: [['createdAt', 'DESC']],
  });

  if (rows.length === 0) {
    return next({ code: 404, message: 'no data found' });
  }

  const totalPages = getTotalPages(count);
  const creatorsInfo = rows.map((c) => ({
    creatorId: c.creatorID,
    username: c.username,
    firstName: c.firstName,
    lastName: c.lastName,
    walletAddress: c.walletAddress,
    image: c.img,
    cover: c.cover,
    bio: c.bio,
    email: c.email,
    portfolio: c.portfolio,
    instagram: c.instagram,
    twitter: c.twitter,
    facebook: c.facebook,
    createdAt: c.createdAt,
  }));

  return res.status(201).json({
    totalPages,
    currentPage: page,
    creatorsInfo,
  });
});

const singleCreator = asyncHandler(async (req, res, next) => {
  const wallet = req.params.walletAddress;
  const { user } = req.query;

  const creator = await Creator.findOne({ where: { walletAddress: wallet } });
  if (!creator) {
    return next({ code: 404, message: 'no data found' });
  }

  const subscribed = await isSubscribed(wallet, user);
  const result = creator.toJSON();
  result.isSubscribed = subscribed;
  return res.status(201).json(result);
});

const updateCreatorInfo = asyncHandler(async (req, res, next) => {
  const { walletAddress, firstName, lastName, email, username } = req.body;
  if (!walletAddress) {
    return next({ code: 400, message: 'No Request Found' });
  }

  const [updated] = await Creator.update(
    { firstName, lastName, email, username },
    { where: { walletAddress } }
  );

  if (!updated) {
    return next({ code: 404, message: 'no data found' });
  }
  return res.status(201).json({ message: 'Info Updated Successfully' });
});

const editPrice = asyncHandler(async (req, res, next) => {
  const { price, wallet } = req.body;
  if (!price || !wallet) {
    return res.status(400).json('bad request');
  }

  await Creator.update(
    { subscrption_price: price },
    { where: { walletAddress: wallet } }
  );
  return res.status(200).json('price edited successfully');
});

const subscribe = asyncHandler(async (req, res, next) => {
  const { subscriber, subscribe_to, price } = req.body;
  if (!subscriber || !subscribe_to || !price) {
    return next({ code: 400, message: 'BAD Request' });
  }

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  await Subscription.create({
    subscriber,
    subscribe_to,
    price,
    end_date: endDate,
  });

  return res.status(201).json({ message: 'Subscribe Successfully' });
});

const updateProfilePic = asyncHandler(async (req, res, next) => {
  const { walletAddress } = req.body;
  const image = req.image;

  if (!walletAddress || !image) {
    return next({ code: 400, message: 'No Request Found' });
  }

  await Creator.update({ img: image }, { where: { walletAddress } });
  return res.status(201).json({ message: 'Profile Picture Updated' });
});

const updateCoverPic = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next({ code: 400, message: 'Please upload a file!' });
  }

  const { walletAddress } = req.body;
  const image = req.file.filename;

  if (!walletAddress || !image) {
    return next({ code: 400, message: 'No Request Found' });
  }

  const [updated] = await Creator.update({ cover: image }, { where: { walletAddress } });
  if (!updated) {
    return next({ code: 404, message: 'no data found' });
  }
  return res.status(201).json({ message: 'Cover Picture Updated' });
});

module.exports = {
  checkEmail,
  checkWallet,
  checkUserName,
  signUp,
  userLogin,
  checkSession,
  allCreators,
  singleCreator,
  updateCreatorInfo,
  editPrice,
  subscribe,
  updateProfilePic,
  updateCoverPic,
};
