const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
require('express-async-errors')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if(!body.title || !body.url) response.status(400).end()

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes ? body.likes : 0
    })

    const newBlog = await blog.save()
    response.status(201).json(newBlog)
})

module.exports = blogsRouter