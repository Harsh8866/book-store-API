## This is a book store REST API project

## Setup Steps
1. clone repositey to local enviorent
2. npm install for instal all dependency
3. setup .evn file for enviorment variables
4. with npm run start project is started.


## Routes
## User Route
1. POST /api/auth/register -> for register new user with name, email and password
2. POST /api/auth/login -> login user with email and password

## Book Route
1. GET /api/books -> This route will return all books with images.
2. POST /api/books -> This route will use for create book and it's admin secure route
3. PATCH /api/books/:id -> THis route will use to update book product based on bookId
4. DELETE /api/books/:id -> This route will delete book based on bookId
5. POST /api/books/:id/images -> This route will use for add images for books
6. DELETE /api/books/:id/images/:imageId -> This route will delete book images based on imageId