const { test, describe } = require('node:test')
const assert = require('node:assert')

const favoriteBlog = require('../utils/list_helper').favoriteBlog

const blogs = require('./blogs')

describe('favorite blog', () => {

    test('when list has only one blog, returns this blog', () => {
        const result = favoriteBlog(blogs.listWithOneBlog)
        const mustReturn = {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }

        assert.deepEqual(result, mustReturn)
    })

    test('when list has many blogs, returns the blog with most likes', () => {
        const result = favoriteBlog(blogs.listWithManyBlogs)
        const mustReturn = {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        }

        assert.deepEqual(result, mustReturn)
    })

    test('when list has not blogs, returns a empty object', () => {
        const result = favoriteBlog(blogs.listWithoutBlogs)
        const mustReturn = {}

        assert.deepEqual(result, mustReturn)
    })

})