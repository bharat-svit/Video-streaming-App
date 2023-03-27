const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')



app.get('/',(req,res) => {
    res.sendFile(__dirname + "/video.html")
})


app.get('/video' , (req,res) =>{

    //Range started as bytes=0- , it means give data from 0 bytes to rest of video but we will send it in chunks

    const range=req.headers.range   
    console.log(range);
    if(!range)
    {
        res.status(400).send('Requires Range Headers')
    }

    const videopath  =  "video.mp4";  // stores video path
    const videosize  =  fs.statSync("video.mp4").size  // stores size of video 

    // As we will not send entire video once , we define chunk size in which video will send

    /* CODE-1 For chunksize */

    // const parts = range.replace(/bytes=/, '').split('-');
    // const start = parseInt(parts[0], 10);
    // const end = parts[1] 
    //   ? parseInt(parts[1], 10)
    //   : fileSize - 1;
    // const chunksize = (end - start) + 1;
    
    /* CODE-2 For chunksize */

    // size of chunk
    const chunksize = 1 * 1e6;
    
    // it will replace all char with empty string and converts it to number
    const start = Number(range.replace(/\D/g, ""))

    // check if end doesn't go beyond video size
    const end = Math.min(start + chunksize, videosize - 1)

    const vidlength = end - start + 1;
    // ---------------------------------------------

    // see video-streaming image (response header)
    const headers  = {

        "Content-Range" : `bytes ${start}-${end}/${videosize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length" : vidlength,
        "Content-Type" : "video/mp4"
    }

    // send headers and status code 
    res.writeHead(206 , headers)

    // we read from file(video) and determine in options the start and end of video
    const videostream  =  fs.createReadStream(videopath, {start, end});
    
    // it converts readable stream to writeable stream  
    videostream.pipe(res)
     
})



app.listen(3000 , ()=>{
    console.log("App is Running ...")
})