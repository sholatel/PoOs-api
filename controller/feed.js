exports.getPosts = (req, res, next) => {
res.status(200).json({ 
    posts : [
    {
        title : "moving parts",
        content : "This is a new post",
        images : "imageUrl/Henny_wealth.jpg"
        }
]
    });
}


exports.CreatePost = (req, res, next) => {
    const title = req.body.title
    const content = req.body.content

    res.status(201).json({
        posts : "resource shared successfully"
    })
}
