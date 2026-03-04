const { Nft, Category, Creator, FixedPrice, Auction } = require('../models');

// Shared include config for NFT queries with all joins
function getNftIncludes() {
  return [
    {
      model: Category,
      as: 'category',
      attributes: ['cat_id', 'cat_name', 'cat_description', 'cat_img'],
    },
    {
      model: Creator,
      as: 'creator',
      attributes: ['creatorID', 'walletAddress', 'username', 'img'],
    },
    {
      model: Creator,
      as: 'owner',
      attributes: ['creatorID', 'walletAddress', 'username', 'img', 'subscrption_price'],
    },
    {
      model: FixedPrice,
      as: 'fixedPriceListing',
      attributes: ['orderId', 'tokenId', 'transactionHash', 'price', 'status'],
      required: false,
      where: { status: 1 },
    },
    {
      model: Auction,
      as: 'auctionListing',
      attributes: ['auctionId', 'tokenId', 'reservePrice', 'highestBid', 'endTimeInSeconds', 'highestBidder', 'status'],
      required: false,
      where: { status: 1 },
      include: [
        {
          model: Creator,
          as: 'bidder',
          attributes: ['walletAddress', 'username', 'img'],
          required: false,
        },
      ],
    },
  ];
}

// Transform a raw NFT with includes into the API response format
function formatNftResponse(nft) {
  const plain = nft.get ? nft.get({ plain: true }) : nft;
  return {
    id: plain.nft_id,
    tokenId: plain.tokenId,
    title: plain.title,
    description: plain.description,
    image: plain.image,
    sale: plain.sale,
    isAuction: plain.auction,
    auctionId: plain.auctionListing?.auctionId || null,
    reservePrice: plain.auctionListing?.reservePrice || null,
    highestBid: plain.auctionListing?.highestBid || null,
    bidderAddress: plain.auctionListing?.bidder?.walletAddress || null,
    bidderUsername: plain.auctionListing?.bidder?.username || null,
    bidderImage: plain.auctionListing?.bidder?.img || null,
    endTimeInSeconds: plain.auctionListing?.endTimeInSeconds || null,
    isFixedPrice: plain.fixedprice,
    orderId: plain.fixedPriceListing?.orderId || null,
    fixedprice: plain.fixedPriceListing?.price || null,
    categoryId: plain.category?.cat_id || null,
    categoryName: plain.category?.cat_name || null,
    categoryDescription: plain.category?.cat_description || null,
    categoryImage: plain.category?.cat_img || null,
    creatorId: plain.creator?.creatorID || null,
    creatorName: plain.creator?.username || null,
    creatorWallet: plain.creator?.walletAddress || null,
    creatorImg: plain.creator?.img || null,
    ownerId: plain.owner?.creatorID || null,
    ownerName: plain.owner?.username || null,
    ownerWallet: plain.owner?.walletAddress || null,
    ownerImg: plain.owner?.img || null,
    createdAt: plain.created_at,
  };
}

// Format for single art (has extra fields)
function formatSingleArtResponse(nft) {
  const base = formatNftResponse(nft);
  const plain = nft.get ? nft.get({ plain: true }) : nft;
  return {
    ...base,
    socialMediaImage: plain.socialMediaImage,
    artistImage: plain.artistImage,
    titleImage: plain.titleImage,
    price: base.fixedprice,
    subscrption_price: plain.owner?.subscrption_price || null,
  };
}

// Format for wallet arts (created/collected - no fixed/auction joins in original)
function formatWalletArtResponse(nft) {
  const plain = nft.get ? nft.get({ plain: true }) : nft;
  return {
    id: plain.nft_id,
    tokenId: plain.tokenId,
    title: plain.title,
    description: plain.description,
    image: plain.image,
    sale: plain.sale,
    auction: plain.auction,
    fixedprice: plain.fixedprice,
    explicityContent: plain.nftType,
    categoryId: plain.category?.cat_id || null,
    categoryName: plain.category?.cat_name || null,
    categoryDescription: plain.category?.cat_description || null,
    categoryImage: plain.category?.cat_img || null,
    creatorId: plain.creator?.creatorID || null,
    creatorName: plain.creator?.username || null,
    creatorWallet: plain.creator?.walletAddress || null,
    creatorImg: plain.creator?.img || null,
    ownerId: plain.owner?.creatorID || null,
    ownerName: plain.owner?.username || null,
    ownerWallet: plain.owner?.walletAddress || null,
    ownerImg: plain.owner?.img || null,
    createdAt: plain.created_at,
  };
}

module.exports = {
  getNftIncludes,
  formatNftResponse,
  formatSingleArtResponse,
  formatWalletArtResponse,
};
