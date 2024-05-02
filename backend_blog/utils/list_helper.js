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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}