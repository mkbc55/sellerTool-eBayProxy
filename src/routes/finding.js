const express = require('express');
const axios = require('axios');
const { findingRequest } = require('../ebayClient');

const router = express.Router();

// Shared param builder for pagination + sort
function paginationParams(query) {
  const params = {};
  if (query.entriesPerPage) params['paginationInput.entriesPerPage'] = query.entriesPerPage;
  if (query.pageNumber) params['paginationInput.pageNumber'] = query.pageNumber;
  if (query.sortOrder) params['sortOrder'] = query.sortOrder;
  return params;
}

// GET /api/finding/keywords?keywords=sneakers&categoryId=15709&entriesPerPage=20&pageNumber=1&sortOrder=BestMatch
router.get('/keywords', async (req, res, next) => {
  try {
    const { keywords, categoryId } = req.query;
    if (!keywords) return res.status(400).json({ error: 'keywords query param is required' });

    const params = {
      'keywords': keywords,
      ...paginationParams(req.query),
    };
    if (categoryId) params['categoryId'] = categoryId;

    const data = await findingRequest('findItemsByKeywords', params);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/finding/category?categoryId=15709&entriesPerPage=20&pageNumber=1
router.get('/category', async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) return res.status(400).json({ error: 'categoryId query param is required' });

    const params = {
      'categoryId': categoryId,
      ...paginationParams(req.query),
    };

    const data = await findingRequest('findItemsByCategory', params);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/finding/completed?keywords=sneakers&conditionId=3000&entriesPerPage=20
router.get('/completed', async (req, res, next) => {
  try {
    const { keywords, conditionId, entriesPerPage } = req.query;
    if (!keywords) return res.status(400).json({ error: 'keywords query param is required' });

    const url = `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=${process.env.EBAY_APP_ID}&RESPONSE-DATA-FORMAT=JSON&keywords=${keywords}&itemFilter(0).name=SoldItemsOnly&itemFilter(0).value=true&itemFilter(1).name=Condition&itemFilter(1).value=${conditionId}&paginationInput.entriesPerPage=${entriesPerPage}&sortOrder=EndTimeSoonest`;

    let response;
    try {
      response = await axios.get(url);
    } catch (axiosErr) {
      if (axiosErr.response) {
        console.error('eBay error response:', axiosErr.response.status, JSON.stringify(axiosErr.response.data));
      }
      return res.status(500).json({ error: 'eBay API error' });
    }

    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

// GET /api/finding/stores?storeName=mystore&keywords=shoes&entriesPerPage=20&pageNumber=1
router.get('/stores', async (req, res, next) => {
  try {
    const { storeName, keywords } = req.query;
    if (!storeName) return res.status(400).json({ error: 'storeName query param is required' });

    const params = {
      'storeName': storeName,
      ...paginationParams(req.query),
    };
    if (keywords) params['keywords'] = keywords;

    const data = await findingRequest('findItemsIneBayStores', params);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/finding/advanced?keywords=sneakers&categoryId=15709&condition=1000&entriesPerPage=20
// condition codes: 1000=New, 2000=Refurbished, 3000=Used
router.get('/advanced', async (req, res, next) => {
  try {
    const { keywords, categoryId, condition, listingType, minPrice, maxPrice } = req.query;
    if (!keywords && !categoryId) {
      return res.status(400).json({ error: 'keywords or categoryId is required' });
    }

    const params = { ...paginationParams(req.query) };
    if (keywords) params['keywords'] = keywords;
    if (categoryId) params['categoryId'] = categoryId;
    if (condition) params['itemFilter(0).name'] = 'Condition', params['itemFilter(0).value'] = condition;
    if (listingType) params['itemFilter(1).name'] = 'ListingType', params['itemFilter(1).value'] = listingType;
    if (minPrice) params['itemFilter(2).name'] = 'MinPrice', params['itemFilter(2).value'] = minPrice;
    if (maxPrice) params['itemFilter(3).name'] = 'MaxPrice', params['itemFilter(3).value'] = maxPrice;

    const data = await findingRequest('findItemsAdvanced', params);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
