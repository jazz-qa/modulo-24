// test.js
const { spec, request } = require('pactum');
const { faker } = require('@faker-js/faker');

request.setBaseUrl('http://lojaebac.ebaconline.art.br');

let token;
let productId;
let price = faker.commerce.price();

beforeEach(async () => {
    token = await spec()
        .post('/public/authUser')
        .withJson({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .returns('data.token')

})

it('Add product', async () => {
    productId = await spec()
        .post('/api/addProduct')
        .withHeaders("Authorization", token)
        .withJson({
            "name": faker.commerce.productName(),
            "price": price,
            "quantity": faker.number.int({ max: 100 }),
            "categories": faker.commerce.department(),
            "description": faker.commerce.productDescription(),
            "photos": faker.image.url(),
            "popular": true,
            "visible": true,
            "location": "Brazil",
            "additionalDetails": faker.commerce.productAdjective(),
            "specialPrice": (price - 10)
        })
        .returns('data._id')
        .expectStatus(200)
        .expectJsonMatch({
            success: true,
            message: "product added"
            // data: like({
            //     "_id": like("680053a6a597f45f11bfa734"),
            //     name: like("Garden"),
            //     photo: like("https://loremflickr.com/640/480?lock=1234"),
            //     createdAt: like("2025-04-17T01:04:38.689Z"),
            //     updatedAt: like("2025-04-17T01:04:38.689Z"),
            //     __v: 0
            // })
        })
});

it('Edit product', async () => {
    await spec()
        .put('/api/editProduct/{id}')
        .withPathParams('id', productId)
        .withHeaders("Authorization", token)
        .withJson({
            "quantity": faker.number.int({ max: 100 }),
            "visible": false
        })
        .expectStatus(200)
        .expectJsonMatch({
            success: true,
            message: "product updated"
        })
});

it('Delete product', async () => {
    await spec()
        .delete('/api/deleteProduct/{id}')
        .withPathParams('id', productId)
        .withHeaders("Authorization", token)
        .withJson({
            "authorization": token
        })
        .expectStatus(200)
        .expectJsonMatch({
            success: true,
            message: "product deleted"
        })
});