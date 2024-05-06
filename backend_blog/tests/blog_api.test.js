const { test, after, describe, beforeEach } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('blog api tests', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identification is called id', async () => {
    const response = await api.get('/api/blogs')

    assert.ok(response.body[0].id)
  })

  test('a new blog can be added', async () => {
    const newBlog = {
      title: 'New Title',
      author: 'Anonymous',
      url: 'New URL',
      likes: 8
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    assert(titles.includes('New Title'))
  })

  test.only('if likes are not specified, they must be 0', async () => {
    const newBlog = {
      title: 'New Title',
      author: 'Anonymous',
      url: 'New URL'
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const likes = blogsAtEnd.map(n => n.likes)
    assert.strictEqual(likes[likes.length - 1], 0)
  })
})

after(async () => {
  await mongoose.connection.close()
})
