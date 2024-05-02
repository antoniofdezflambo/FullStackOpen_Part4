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

module.exports = {
    dummy,
    totalLikes
}