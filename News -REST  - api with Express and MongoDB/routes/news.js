const express = require('express');
const router = express.Router();
const News = require('../models/news');

// Getting all sub

router.get('/',async (req,res)=>{
    try {
        const news = await News.find();
        let newsFiltered  = news;
        if(req.body.filterby != null){
            for (const [key, value] of Object.entries(req.body.filterby)) {
                if(key == 'date'){
                    newsFiltered = newsFiltered.filter(function(element){
                        if(JSON.stringify(element.date).includes(value)){
                            return true;
                        }
                        return false;
                        
                    })
                }else if(key == 'title'){
                    newsFiltered = newsFiltered.filter(function(element){
                        if(element.title.includes(value)){
                            return true;
                        }
                        return false;
                        
                    })
                }
            }
        }
        if(req.body.sortby != null){
            let entries =  Object.entries(req.body.sortby);
            let [key,value] = entries[0];
            let [key1,value1] = entries[1] ? entries[1] : [undefined,undefined] ;
            if(key == 'date'){
                newsFiltered = newsFiltered.sort(function(a,b){      
                    if(a.date.getTime() - b.date.getTime() == 0){
                        if(value1 == "-"){
                            return a.title - b.title;
                        }else if(value1 == "+"){
                            return a.title + b.title;
                        }
                    }
                    if(value == "-"){
                        return b.title.localeCompare(a.title);
                    }else if(value == "+"){
                        return a.title.localeCompare(b.title);
                    }

                })
            }else if(key == 'title'){
                newsFiltered = newsFiltered.sort(function(a,b){   
                    if(a.title == b.title){
                        if(value1 == "-"){
                            return a.date.getTime() - b.date.getTime();
                        }else if(value1 == "+"){
                            return (a.date.getTime() - b.date.getTime())*(-1);
                        }
                    }   
                    if(value == "-"){
                        return b.title.localeCompare(a.title);
                    }else if(value == "+"){
                        return a.title.localeCompare(b.title);
                    }
                })
            }
            
        }
        res.json(newsFiltered||news);
    }catch(err) {
        res.status(500).json({message:err.message}) 
    }
})


router.get('/:id',getNews,(req,res)=>{
    res.json(res.news);   
})

router.post('/', async (req,res)=>{
    const news = new News({
        text : req.body.text,
        description: req.body.description,
        title : req.body.title
    })
    try {
        const newNews = await news.save();
        res.status(201).json(newNews)  
    }catch (err){
        res.status(400).json({message : err.message});
    }
})

router.patch('/:id',getNews,async (req,res)=>{
    if(req.body.text != null) {
        res.news.text = req.body.text;
    }
    if(req.body.description != null) {
        res.news.description = req.body.description;
    }
    if(req.body.title != null) {
        res.news.title = req.body.title;
    }
    try{
        const updatedNews = await res.news.save();
        res.json(updatedNews);
    }catch(err) {
        res.status(400).json({message : err.message});
    }
})

router.delete('/:id',getNews,async (req,res)=>{
    try {
        await res.news.remove();
        res.json({message : "Deleted news"  })
    }catch (err) {
        res.status(500).json({ message: err.message})
    }
})

async function getNews(req,res,next) {
    let news
    try {
        news = await News.findById(req.params.id);
        if(news == null){
            return res.status(404).json({message: 'Cannot find news'});
        }
    }catch (err){
        return res.status(500).json({ message: err.message})
    }
    res.news = news
    next();
}


module.exports = router; 