const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    var total = 0
    blogs.forEach(element => {
        total += element.likes
    });

    return total
}

const favoriteBlog = (blogs) => {
    var favorite

    blogs.forEach(element => {
        if(!favorite || element.likes > favorite.likes)
            favorite = element
    })

    return favorite ? favorite : {}
}

const mostBlogs = (blogs) => {
    if(blogs.length < 1) return {}

    const blogCounts = _.countBy(blogs, 'author')
    const maxBlogs = _.maxBy(_.keys(blogCounts), author => blogCounts[author])

    return {
        author: maxBlogs,
        blogs: blogCounts[maxBlogs]
    }
}

const mostLikes = (blogs) => {
    if(blogs.length < 1) return {}

    const authors = _.groupBy(blogs, 'author')
    const likes = _.mapValues(authors, author => _.sumBy(author, 'likes'))
    
    const maxLikes = _.maxBy(_.keys(likes), author => likes[author])

    return {
        author: maxLikes,
        likes: likes[maxLikes]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}