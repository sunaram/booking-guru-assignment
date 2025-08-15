# Booking Guru Take Home Assignment - API  
[Backend Recruitment Task](./Backend%20Recruitment%20Task.odt)

## How to Run
### Environment
Create .env file. A sample .env.example is provided  

### Install necessary packages
```npm run install```
### Dev
```npm run dev```
### Prod
```
npm run build
npm start
```

## OpenAPI Docs
```http://localhost:3000/api-docs```  
OpenAPI swagger UI is only available when NODE_ENV is set to "Dev"

## Static API Docs
[Pollution API](./docs/POLLUTION_API.md)

## Assumptions
- An International City Name can have international characters, space in between non-space characters, hyphens ~~, apostrophes, periods and digits~~
- Wiki API Call endpoint: https://en.wikipedia.org/w/api.php?action=query&titles=[CITY_NAME]&prop=description&format=json
- Wiki rate limit error will cause the "description" enhancements for the cities to fail. They have a limit of 500 requests per hour per ip for anonymous calls. A personal API token would increase this to 5000. https://api.wikimedia.org/wiki/Rate_limits
- The result contains cities without description, with the assumption that a city may not have a page on Wiki.