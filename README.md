# sellerTool-eBayProxy

Express proxy server that forwards requests to the [eBay Finding API](https://developer.ebay.com/Devzone/finding/Concepts/FindingAPIGuide.html), keeping your eBay App ID off the client.

## Setup

```bash
npm install
cp .env.example .env   # fill in your EBAY_APP_ID
npm start              # or: npm run dev
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `EBAY_APP_ID` | Yes | eBay Developer App ID (Production) |
| `PORT` | No | Server port (default `3001`) |
| `ALLOWED_ORIGINS` | No | Comma-separated allowed CORS origins |

## Endpoints

All routes are relative to `/api/finding`.

### `GET /keywords`
Search by keyword.

| Param | Required | Description |
|---|---|---|
| `keywords` | Yes | Search terms |
| `categoryId` | No | Limit to category |
| `entriesPerPage` | No | Results per page (max 100) |
| `pageNumber` | No | Page number |
| `sortOrder` | No | `BestMatch`, `PricePlusShippingLowest`, `EndTimeSoonest`, etc. |

### `GET /category`
Browse a category.

| Param | Required |
|---|---|
| `categoryId` | Yes |
| `entriesPerPage` / `pageNumber` / `sortOrder` | No |

### `GET /completed`
Search sold/completed listings (useful for pricing research).

| Param | Required |
|---|---|
| `keywords` or `categoryId` | At least one |

### `GET /stores`
Search within an eBay store.

| Param | Required |
|---|---|
| `storeName` | Yes |
| `keywords` | No |

### `GET /advanced`
Fine-grained search with item filters.

| Param | Required | Notes |
|---|---|---|
| `keywords` or `categoryId` | At least one | |
| `condition` | No | `1000`=New, `2000`=Refurbished, `3000`=Used |
| `listingType` | No | `Auction`, `FixedPrice`, `AuctionWithBIN` |
| `minPrice` / `maxPrice` | No | USD |

### `GET /health`
Returns `{ "status": "ok" }` — useful for uptime checks.

## Rate limiting

60 requests per minute per IP. Responds with HTTP 429 when exceeded.
