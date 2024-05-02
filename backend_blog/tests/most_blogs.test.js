const { test, describe } = require('node:test')
const assert = require('node:assert')

const mostBlogs = require('../utils/list_helper').mostBlogs
const blogs = require('./blogs')

describe('most blogs', () => {

    test('when list has only one blog, returns the author and the number of blogs', () => {
        const result = mostBlogs(blogs.listWithOneBlog)
        const expected = {
            author: 'Edsger W. Dijkstra',
            blogs: 1
        }

        assert.deepEqual(result, expected)
    })

    test('when list has many blogs, returns the author that has most blogs and the number of blogs', () => {
        const result = mostBlogs(blogs.listWithManyBlogs)
        const expected = {
            author: 'Robert C. Martin',
            blogs: 3
        }

        assert.deepEqual(result, expected)
    })

    test('when list has no blogs, returns an empty object', () => {
        const result = mostBlogs(blogs.listWithoutBlogs)
        assert.deepEqual(result, {})
    })

})
