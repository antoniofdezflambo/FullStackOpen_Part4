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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}