# Booking Guru API

API for getting pollution data for cities in a country.

## `GET /cities`

Retrieve pollution data for cities in a specific country.

### Parameters

| Name      | In    | Required | Type    | Description                               |
|-----------|-------|----------|---------|-------------------------------------------|
| `country` | query | Yes      | string  | The country to fetch pollution data for.  |
| `page`    | query | No       | integer | The page number for pagination. Default: 1. |
| `limit`   | query | No       | integer | The number of items per page. Default: 10.  |

### cURL Sample
```
curl -X 'GET' \
  'http://localhost:3000/cities?country=PL&page=1&limit=10' \
  -H 'accept: application/json'
```

### Responses

#### 200 - A paginated list of cities with their pollution data.

**Example:**
```json
{
  "page": 1,
  "limit": 1,
  "total": 100,
  "cities": [
    {
      "name": "London",
      "country": "United Kingdom",
      "pollution": 55,
      "description": "Capital city of England"
    }
  ]
}
```

#### 400 - Bad Request

Invalid or missing parameters.

#### 500 - Internal Server Error

Server-side error.
