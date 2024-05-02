const { test, describe } = require('node:test')
const assert = require('node:assert')

const totalLikes = require('../utils/list_helper').totalLikes

const blogs = require('./blogs')

describe('total likes', () => {

    test('when list has only one blog, equals the likes of that', () => {
        const result = totalLikes(blogs.listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when list has many blogs, equals the sum of them', () => {
        const result = totalLikes(blogs.listWithManyBlogs)
        assert.strictEqual(result, 36)
    })

    test('when list has not any blogs, returns 0', () => {
        const result = totalLikes(blogs.listWithoutBlogs)
        assert.strictEqual(result, 0)
    })
})