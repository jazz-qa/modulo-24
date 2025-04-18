// test.js
const { spec, request } = require('pactum');
const { like } = require('pactum-matchers');
const { faker } = require('@faker-js/faker');

request.setBaseUrl('http://lojaebac.ebaconline.art.br');

let token;
let categoryId;

beforeEach(async () => {
    token = await spec()
        .post('/public/authUser')
        .withJson({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .returns('data.token')

})

it('Add category', async () => {
    categoryId = await spec()
        .post('/api/addCategory')
        .withHeaders("Authorization", token)
        .withJson({
            "name": faker.commerce.department(),
            "photo": faker.image.url()
        })
        .returns('data._id')
        .expectStatus(200)
        .expectJsonMatch({
            success: true,
            message: "category added",
            data: like({
                "_id": like("680053a6a597f45f11bfa734"),
                name: like("Garden"),
                photo: like("https://loremflickr.com/640/480?lock=1234"),
                createdAt: like("2025-04-17T01:04:38.689Z"),
                updatedAt: like("2025-04-17T01:04:38.689Z"),
                __v: 0
            })
        })
});

it('Edit category', async () => {
    await spec()
        .put('/api/editCategory/{id}')
        .withPathParams('id', categoryId)
        .withHeaders("Authorization", token)
        .withJson({
            "name": faker.commerce.department(),
            "photo": faker.image.url()
        })
        .expectStatus(200)
        .expectJsonMatch({
            success: true,
            message: "category updated"
        })
});

it('Delete category', async () => {
    await spec()
        .delete('/api/deleteCategory/{id}')
        .withPathParams('id', categoryId)
        .withHeaders("Authorization", token)
        .expectStatus(200)
        .expectJsonMatch({
            success: true,
            message: "category deleted"
        })
});