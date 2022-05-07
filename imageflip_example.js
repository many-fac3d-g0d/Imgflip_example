const request = require('request');
const axios = require('axios');
const dotenv = require('dotenv');
const fsPromises = require('fs').promises;
const fs = require('fs');

dotenv.config();
const API_URL = "https://api.imgflip.com/caption_image";

/* Example to show how promises are created 
function testTimeout(val){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(val === "pass")
                resolve();
            else
                reject("fail");
        }, 5000)
        
    })
}*/

/* Using Callbacks */

function testCallback(){
    request({
        url: API_URL,
        qs: {
            template_id: '101716',
            username: process.env.IMGFLIP_USERNAME,
            password: process.env.IMGFLIP_PASSWORD,
            text0: 'Yo I heard you like callbacks',
            text1: 'So we put callbacks in your callback so you can callback while you callback',
            }
    
        }, (err, resp, body) => {
        if(err){
            console.log(err);
            return;
        }
        console.log("Using callbacks meme created ",resp.body);
        const respBody = JSON.parse(resp.body);

        request.get({

                url: respBody.data.url,
                encoding: null //request by default encodes data to UTF-8 which is not suitable for images
            
            }, (err, imgResp, buffer) => {
            if(err){
                console.log(err);
                return;
            }
            console.log("Meme image fetched : ", imgResp.statusCode);
            
            fs.writeFile('meme_from_callbacks.jpg', buffer, (err) => {
                if(err){
                    console.log(err);
                    return;
                }
                console.log("Meme file written successfully");
            })
        })
    });
}

/* Using promises */

function testPromises(){
    axios.post(
        API_URL,
        {},
        {
            params: {
                template_id: '61579',
                username: process.env.IMGFLIP_USERNAME,
                password: process.env.IMGFLIP_PASSWORD,
                text0: 'One does not simply',
                text1: 'Learn async & await without understanding promises',
            },
        }
    )
    .then((res) => {
        console.log("Using promises Meme created : ",res.data);

        axios.get(res.data.data.url,
            { 
                responseType: 'arraybuffer' 
            }
        )
        .then((imgResp) => {
            console.log("Meme image fetched : ", imgResp.statusCode);

            fsPromises.writeFile('meme_from_promise.jpg',imgResp.data)
            .then(() => {
                console.log("Meme file written successfully");
            })
        })
    })
    .catch((err) => {
        console.log(err);
    });
}


/* Using async await */

async function testAwait(){
    try{
        const response = await axios.post(
            API_URL,
            {},
            {
                params: {
                    template_id: '100947',
                    username: process.env.IMGFLIP_USERNAME,
                    password: process.env.IMGFLIP_PASSWORD,
                    text0: 'What if I told you',
                    text1: 'There is an easy way to write async code in js',
                },
            }
        );
        console.log("Using Async/Await Meme created : ", response.data);

        //await testTimeout("fail");
    
        const imgResponse = await axios.get(response.data.data.url,
            { 
                responseType: 'arraybuffer' 
            }
        )
        console.log("Meme image fetched : ", imgResponse.data.statusCode);
    
        await fsPromises.writeFile('meme_from_async_await.jpg', imgResponse.data);
        console.log("Meme file written successfully");
    }
    catch(err){
        console.log("Error occurred : ",err);
    }
    

}

//testCallback();
//testPromises();
testAwait();
console.log("Some sync task");