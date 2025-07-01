
# Backend API DOCUMENTATIONS

# API Reference

## USERS - 

#### Default selector API 

```http
  /api/users
```

| Endpoint  | Method     | Description                |
| :-------- | :------- | :------------------------- |
| `/get-all` | `GET` | Get All users |
| `/get-by-id/${id}` | `GET` | Get details of Specific User  |
| `/create-user` | `POST` | Create new user | 
| `/update-user/${id}` | `PUT` | Update user by ID |
| `/delete-user/${id}` | `DELETE` | Delete specific user by ID |
| `/login` | `POST` | LOGIN TO USER USING JWT |



## Schema for creating/updating USER

```php
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  phone     String?
  address   String?
  imageUrl  String?
```


## Dummy data example for /create-user

```php
{
  "name": "Adarsh Mehta",
  "email": "adarsh.mehta@example.com",
  "password": "adarsh@pandit.cro",
  "role": "ADMIN",
  "phone": "+91-9876543210",
  "address": "123, Vivekananda Colony, Ward No. 13, West Bengal, India",
  "imageUrl": "https://example.com/profile/adarsh.jpg"
}

```

## Marketplace - 
#### Default selector API 

```http
  /api/marketplace
```

| Endpoint  | Method     | Description                |
| :-------- | :------- | :------------------------- |
| `/get-all` | `GET` | Get All items  |
| `/get-by-category/${category}` | `GET` | Get list of items of specific category @default ("General") |
| `/create` | `POST` | Create new item list | 
| `/update/${id}` | `PUT` | Update specific item by ID |
| `/delete/${id}` | `DELETE` | Delete specific item by ID |



## Schema for creating/updating USER

```php
    name                     String
    description              String
    imageUrl                 String[]
    category                 String?   @default("General")
    createdById              UserID - id of logged in user
```

## dummy example of data for /create - 

```python
{
  "name": "Modern Furniture Store",
  "description": "A curated collection of modern and minimalist furniture pieces.",
  "imageUrl": [
    "https://example.com/images/sofa.jpg",
    "https://example.com/images/table.jpg"
  ],
  "category": "Furniture",
  "createdById": "cmc336bd30000sbg4e66pcir9"
}
```

## Property - 
#### Default selector API 

```http
  /api/property
```

| Endpoint  | Method     | Description                |
| :-------- | :------- | :------------------------- |
| `/get-all` | `GET` | Get All items  |
| `/get-by-category/${category}` | `GET` | Get list of items of specific category @default ("Houses") |
| `/create` | `POST` | Create new item list | 
| `/update/${id}` | `PUT` | Update specific item by ID |
| `/delete/${id}` | `DELETE` | Delete specific item by ID |



## Schema for creating/updating USER

```php
    name                     String
    description              String
    imageUrl                 String[]
    category                 String?   @default("Houses")
    createdById              UserID - id of logged in user
```

## dummy example of data for /create - 

```python
{
  "name": "Green Villa - 4BHK Independent House",
  "description": "A beautiful 4-bedroom independent villa with a garden, parking space, and modern interior. Located in a peaceful residential area of Salt Lake, Kolkata.",
  "imageUrl": [
    "https://example.com/images/green-villa-front.jpg",
    "https://example.com/images/green-villa-garden.jpg",
    "https://example.com/images/green-villa-living.jpg",
    "https://example.com/images/green-villa-bedroom.jpg"
  ],
  "category": "Housees",
  "createdById": "cmc336bd30000sbg4e66pcir9"
}

```


## Products - 
#### Default selector API 

```http
  /api/product
```

| Endpoint  | Method     | Description                |
| :-------- | :------- | :------------------------- |
| `/get-all` | `GET` | Get All items  |
| `/get-by-id/${id}` | `GET` | Get details of specific item  |
| `/get-by-category/${category}` | `GET` | Get list of items of specific category @default ("Houses") |
| `/create-product` | `POST` | Create new item list | 
| `/update-product/${id}` | `PUT` | Update specific item by ID |
| `/delete-product/${id}` | `DELETE` | Delete specific item by ID |


## Schema for creating/updating Products

```php
  name                String
  description         String
  images              String[]
  price               String
  discount            Int
  ratings             Int
  features            String[]
  highlights          String[]
  insideBox           String[]
  category            String?
  sellerId            String
```
