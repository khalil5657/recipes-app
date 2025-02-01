const express = require("express");

const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")

const fs = require('fs')

const jwt = require('jsonwebtoken')
const app = express();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

app.use(express.json())
app.use(cookieParser())
var cors = require('cors');

app.set("trust proxy", 1);

require("dotenv").config()


const cloudinary = require('cloudinary').v2
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

let originUrl = "http://localhost:5173"

app.use(cors({
    origin: originUrl,
    methods : ["PUT", "DELETE", "POST", "GET"],
    credentials: true
}))

app.get("/", (req, res)=>{
    res.send("success")
})

app.post("/signup", async (req, res)=>{
    const { username, password } = req.body
    try{
        
        const existingUser = await prisma.user.findUnique({
        where: {
            username: username
            }
        })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
            }
            })
        res.send(user)
    }catch{
        res.send("problem")
    }
})

app.post("/addprofileimage/:id", upload.single("image"), async(req, res)=>{
    const { originalname, size, path } = req.file;
    try{
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret :process.env.API_SECRET
    });
    const results = await cloudinary.uploader.upload(path, {resource_type: 'auto'})
    await prisma.user.update({
      where:{
        id: req.params.id
      },
      data:{
        img:{
          create:{
            name: originalname,
            url: results.secure_url
          }
        }
      }
    })
    // Clear temporary local download
    fs.unlinkSync(path);
    res.send({message:"success"})
    }catch(error){
      res.send({message:'unsucsessfull'})
    }
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body
    try {
      const user = await prisma.user.findUnique({
        where: { username }
      })
      if (!user) {
        return res.status(400).json({ message: 'User doesnt exist.' })
      }
      
      const isMatch = await bcrypt.compare(password, user.password)
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' })
      }
  
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        'bigsecret',
        // { expiresIn: '1h' }
      )
      res.cookie('jwt', token, {
        httpOnly:true,
        maxAge: 24 *60 *60 * 1000,
        sameSite:"none",
          secure:true
      })
      res.json(user)
    }catch (error) {
      res.status(402).json({ message: 'Server error.', error: error.message })
    }
})

app.post("/logout", (req, res)=>{
    res.cookie("jwt", "", {maxAge:0})
    res.send({message:"secsess"})
})
//// cookie stays on the page url or origin cokkies in the browser
app.get("/user", async(req, res)=>{
    try{
        const cookie = req.cookies['jwt']
        const claims = jwt.verify(cookie, "bigsecret")
        if (!claims){
            return res.status(404).send({message:"unauthenticated"})
        }
        const user = await prisma.user.findUnique({
            where:{
                id:claims.userId
            },
            include:{
              img:true,
            }
        })
        res.send(user)

    }catch{
        return res.status(404).send({message:"something went wrong"})
    }
})

app.get("/:type/recipes/:mode", async(req, res)=>{
    if (req.params.mode=="rating"){
        const recipes = await prisma.recipe.findMany({
            where:{
                category:req.params.type
            },
            include:{
                img:true,
                reviews:{
                    orderBy:{
                        posteddate:"desc"
                    }
                },
                writer:{
                    include:{
                        img:true
                    }
                }
            },
            orderBy:{
                rating:"desc"
            }
        })
        res.status(200).json({recipes:recipes})
    }else{
        const recipes = await prisma.recipe.findMany({
            where:{
                category:req.params.type
            },
            include:{
                img:true,
                reviews:{
                    orderBy:{
                        posteddate:"desc"
                    }
                },
                writer:{
                    include:{
                        img:true
                    }
                }
            },
            orderBy:{
                posteddate:"desc"
            }
        })
        res.status(200).json({recipes:recipes})
    }
    
})

app.post("/recipe/:type", async(req, res)=>{
    const recipe = await prisma.recipe.create({
        data:{
            title:req.body.title,
            description:req.body.description,
            ingredients:req.body.ingredients,
            instructions:req.body.instructions,
            nutvalue:Number(req.body.nutvalue),
            writerid:req.body.writerid,
            category:req.params.type
        }
    })
    res.send(recipe)
})

app.post("/addrecipeimage/:id", upload.single("image"), async(req, res)=>{
    const { originalname, size, path } = req.file;
    console.log("pokooijsioiosjosi")
    try{
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret :process.env.API_SECRET
    });
    const results = await cloudinary.uploader.upload(path, {resource_type: 'auto'})
    const recipe = await prisma.recipe.update({
      where:{
        id: req.params.id
      },
      data:{
        img:{
          create:{
            name: originalname,
            url: results.secure_url
          }
        }
      }
    })
    // Clear temporary local download
    fs.unlinkSync(path);
    console.log(recipe, 'pp')
    res.send({message:"success"})
    }catch(error){
      res.send({message:'unsucsessfull'})
    }
})

app.get("/recipe/:id", async(req, res)=>{
    const recipe = await prisma.recipe.findUnique({
        where:{
            id:req.params.id
        },
        include:{
            img:true,
            reviews:{
                include:{
                    writer:true
                },
                orderBy:{
                    posteddate:"desc"
                }
            }
        }
    })
    res.send(recipe)
})

app.post("/review", async(req, res)=>{
    /// create review 
    await prisma.review.create({
        data:{
            title:req.body.title,
            description:req.body.description,
            rating:Number(req.body.rating),
            writerid:req.body.writerid,
            recipeid:req.body.recipeid
        }
    })
    /// get all recipe reviews to count the ratings
    const recipeReviews = await prisma.review.findMany({
        where:{
            recipeid:req.body.recipeid
        }
    })
    let ratings = recipeReviews.map(review=>review.rating)
    /// divition of sum of rating by number of reviews to get rating
    let sum = ratings.reduce( (acc,e ) => acc + e , 0)
    let recipeRating = Number(parseFloat(sum/ratings.length).toFixed(2))
    /// add rating to recipe
    await prisma.recipe.update({
        where:{
            id:req.body.recipeid
        },
        data:{
            rating:recipeRating
        }
    })
    res.status(200).json({message:"success"})
})

app.get("/recipes", async(req, res)=>{
    const recipesRaw = await prisma.recipe.findMany({
        include:{
            img:true,
            reviews:{
                orderBy:{
                    posteddate:"desc"
                }
            }
        }
    })
    const recipes = []
    while (recipes.length<4){
        let times = 0
        const randomElement = recipesRaw[Math.floor(Math.random() * recipesRaw.length)];
        for (let item of recipes){
            if (item.id==randomElement.id){
                times++
            }
        }
        if (times==0){
            recipes.push(randomElement)
        }
    }
    res.send(recipes)
})

app.get("/savedrecipes/:id/:by", async(req, res)=>{
    if (req.params.by=="date"){
        const recipes = await prisma.recipe.findMany({
            where:{
                userswhosaved:{
                    has:req.params.id
                }
            },
            include:{
                img:true
            },
            orderBy:{
                posteddate:"desc"
            }
        })
        res.send(recipes)
    }else if (req.params.by=="rating"){
        const recipes = await prisma.recipe.findMany({
            where:{
                userswhosaved:{
                    has:req.params.id
                }
            },
            include:{
                img:true
            },
            orderBy:{
                rating:"desc"
            }
        })
        // const aa = await prisma.review.findMany({

        // })
        res.send(recipes)
    }else{
        const recipes = await prisma.recipe.findMany({
            where:{
                userswhosaved:{
                    has:req.params.id
                }
            },
            include:{
                img:true
            },
            orderBy:{
                nutvalue:"desc"
            }
        })
        res.send(recipes)
    }
    
})

app.get("/createdrecipes/:id/:by", async(req, res)=>{
    if (req.params.by=="date"){
        const recipes = await prisma.recipe.findMany({
            where:{
                writerid:req.params.id
            },
            include:{
                img:true
            }
        })
        res.send(recipes)
    }else if (req.params.by=="rating"){
        const recipes = await prisma.recipe.findMany({
            where:{
                writerid:req.params.id
            },
            include:{
                img:true
            },
            orderBy:{
                rating:"desc"
            }
        })
        res.send(recipes)
    }else{
        const recipes = await prisma.recipe.findMany({
            where:{
                writerid:req.params.id
            },
            include:{
                img:true
            },
            orderBy:{
                nutvalue:"desc"
            }
        })
        res.send(recipes)
    }
    
})

app.get("/postedreviews/:id", async(req, res)=>{
    const postedReviews = await prisma.review.findMany({
        where:{
            writerid:req.params.id
        },
        include:{
            writer:true
        },
        orderBy:{
            posteddate:"desc"
        }
    })
    res.send(postedReviews)
})

app.post("/saverecipe", async(req, res)=>{
    await prisma.recipe.update({
        where:{
            id:req.body.recipeid
        },
        data:{
            userswhosaved:{
                push:req.body.userid
            }
        },
    })
    res.status(200).json({message:"success"})
})

app.delete("/deletesavedrecipe", async(req, res)=>{
    const old = await prisma.recipe.findUnique({
        where:{
            id:req.body.recipeid
        }
    })
    let newOne = old.userswhosaved.filter(id=>id!=req.body.userid)
    await prisma.recipe.update({
        where:{
            id:req.body.recipeid
        },
        data:{
            userswhosaved:newOne
        }
    })
    res.status(200).json({message:"success"})
})

app.get("/search/:word/:mode", async(req, res)=>{
    if (req.params.mode=="rating"){
    const recipes = await prisma.recipe.findMany({
        where:{
            title:{
                contains:req.params.word,
                mode:"insensitive"
            }
        },
        include:{
            img:true
        },
        orderBy:{
            rating:"desc"
        }
    })
    res.send(recipes)
    }else if (req.params.mode=="date"){
        const recipes = await prisma.recipe.findMany({
            where:{
                title:{
                    contains:req.params.word,
                    mode:"insensitive"
                }
            },
            include:{
                img:true
            },
            orderBy:{
                posteddate:"desc"
            }
        })
        res.send(recipes)
    }else{
        const recipes = await prisma.recipe.findMany({
            where:{
                title:{
                    contains:req.params.word,
                    mode:"insensitive"
                }
            },
            include:{
                img:true
            },
            orderBy:{
                nutvalue:"desc"
            }
        })
        res.send(recipes)
    }
})

app.listen(3000)
