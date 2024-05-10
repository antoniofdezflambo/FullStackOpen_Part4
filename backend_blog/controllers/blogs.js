const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
require('express-async-errors')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const user = request.user
    const body = request.body

    if(!user) return response.status(400).json({
        error: 'token does not correspond to any user'
    })

    if(!body.title || !body.url) return response.status(400).json({
        error: 'a blog must contains title and url'
    })
    
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes ? body.likes : 0,
        user: user.id
    })

    const newBlog = await blog.save()
    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()

    response.status(201).json(newBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user
    if(!user) return response.status(400).json({
        error: 'token does not correspond to any user'
    })
    
    const blog = await Blog.findById(request.params.id)

    if(!blog) return response.status(400).json({ error: 'blog does not exist' })

    if(user.id.toString() === blog.user.toString()) {
        await Blog.deleteOne({ _id: blog.id })
        
        user.blogs = user.blogs.filter(element => element.toString() !== blog.id.toString())
        await user.save()

        return response.status(204).end()
    }

    return response.status(400).json({
        error: 'token does not correspond to the creator'
    })
})

blogsRouter.put('/:id', async (request,response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const newBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(newBlog)
})

module.exports = blogsRouter