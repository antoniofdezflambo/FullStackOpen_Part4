const { test, after, describe, beforeEach } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const bcrypt = require('bcrypt')

const api = supertest(app)

let token, userBlogId
beforeEach(async () => {
  // blogs
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  // user
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({
    username: 'user',
    name: 'Test User',
    passwordHash: passwordHash
  })
  await user.save()

  const res = await api
    .post('/api/login')
    .send({
      username: 'user',
      password: 'password'
    })

  token = res.body.token

  // user blog
  const userBlog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: "Titulo de prueba con TOKEN",
      author: "Autor de prueba con TOKEN",
      url: "URL de prueba con TOKEN",
      likes: 9
    })

  userBlogId = userBlog.body.id
})

describe('blog api tests ', () => {
  test('all blogs are returned', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, blogsAtStart.length)
  })

  test('unique identification is called id', async () => {
    const response = await api.get('/api/blogs')

    assert.ok(response.body[0].id)
  })

  describe('adding new blogs', () => {

    test('a new blog can be added', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: 'New Title',
        author: 'Anonymous',
        url: 'New URL',
        likes: 8
      }

      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('New Title'))
    })

    test('if likes are not specified, they must be 0', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newBlog = {
        title: 'New Title',
        author: 'Anonymous',
        url: 'New URL'
      }

      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

      const likes = blogsAtEnd.map(n => n.likes)
      assert.strictEqual(likes[likes.length - 1], 0)
    })

    test('if title or url are not specified, bad request', async () => {
      const newBlogWithoutTitle = {
        author: 'Anonymous',
        url: 'New URL',
        likes: 8
      }

      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithoutTitle)
        .expect(400)

      const newBlogWithoutURL = {
        title: 'New Title',
        author: 'Anonymous',
        likes: 8
      }

      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithoutURL)
        .expect(400)
    })
  })

  describe('deleting a blog', () => {
    test('blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart.find(blog => blog.id === userBlogId)

      await api.delete(`/api/blogs/${userBlogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(n => n.title)
      assert(!titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtStart.length - 1, blogsAtEnd.length)

    })

    test('deleting a blog fails if there is no token', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart.find(blog => blog.id === userBlogId)

      await api.delete(`/api/blogs/${userBlogId}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
    })
  })

  describe('updating a blog', () => {
    test('updating a blog with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const likes = {
        likes: 13
      }

      await api.put(`/api/blogs/${blogToUpdate.id}`)
        .send(likes)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd[0]
      assert.notStrictEqual(blogToUpdate.likes, updatedBlog.likes)
      assert.strictEqual(updatedBlog.likes, 13)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
