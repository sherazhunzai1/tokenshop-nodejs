const PAGE_SIZE = 8;

function getPagination(pageNo) {
  const page = Number(pageNo) || 1;
  const offset = (page - 1) * PAGE_SIZE;
  return { offset, limit: PAGE_SIZE, page };
}

function getTotalPages(count) {
  return Math.ceil(Math.max(count - 1, 0) / PAGE_SIZE);
}

module.exports = { getPagination, getTotalPages, PAGE_SIZE };
