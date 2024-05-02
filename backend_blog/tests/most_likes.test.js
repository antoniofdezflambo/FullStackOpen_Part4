const { test, describe } = require('node:test')
const assert = require('node:assert')

const mostLikes = require('../utils/list_helper').mostLikes
const blogs = require('./blogs')

describe('most likes', () => {

    test('when list has only one blog, returns the author and the number of likes', () => {
        const result = mostLikes(blogs.listWithOneBlog)
        const expected = {
            author: 'Edsger W. Dijkstra',
            likes: 5
        }

        assert.deepEqual(result, expected)
    })

    test('when list has many blogs, returns the author that has most likes and the number of likes', () => {
        const result = mostLikes(blogs.listWithManyBlogs)
        const expected = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        }

        assert.deepEqual(result, expected)
    })

    test('when list has no blogs, returns an empty object', () => {
        const result = mostLikes(blogs.listWithoutBlogs)
        assert.deepEqual(result, {})
    })

})
