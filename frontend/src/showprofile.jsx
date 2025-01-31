import { useEffect, useState } from "react"
import { Link, useOutletContext } from "react-router"

function ShowProfile(){
    const [user, setUser] = useOutletContext()
    const [loading, setLoading] = useState(true)
    const [savedRecipes, setSavedRecipes] = useState([])
    const [createdRecipes, setCreatedRecipes] = useState([])
    const [postedReviews, setPostedReviews] = useState([])
    const [savedRecipesByStars, setSavedRecipesByStars] = useState([])
    const [createdRecipesByStars, setCreatedRecipesByStars] = useState([])
    const [sortBy, setSortBy] = useState("rating")

    useEffect(()=>{
        (
            async ()=>{

                const savedRecipesRaw = await fetch(`${import.meta.env.VITE_FETCH_URL}/savedrecipes/${user.id}/date`, {
                    method:"GET",
                    headers:{'Content-Type':'application/json'}
                })
                const savedRecipes = await savedRecipesRaw.json()
                setSavedRecipes(savedRecipes)
                console.log(savedRecipes)
                //// the recipes by stars rating
                const savedRecipesRawByStars = await fetch(`${import.meta.env.VITE_FETCH_URL}/savedrecipes/${user.id}/rating`, {
                    method:"GET",
                    headers:{'Content-Type':'application/json'}
                })
                const savedRecipesByStars = await savedRecipesRawByStars.json()
                setSavedRecipesByStars(savedRecipesByStars)
                console.log(savedRecipesByStars)
                const createdRecipesRaw = await fetch(`${import.meta.env.VITE_FETCH_URL}/createdrecipes/${user.id}/date`, {
                    method:"GET",
                    headers:{'Content-Type':'application/json'}
                })
                const createdRecipes = await createdRecipesRaw.json()
                setCreatedRecipes(createdRecipes)
                //// recipes by stars rating
                const createdRecipesRawByStars = await fetch(`${import.meta.env.VITE_FETCH_URL}/createdrecipes/${user.id}/rating`, {
                    method:"GET",
                    headers:{'Content-Type':'application/json'}
                })
                const createdRecipesByStars = await createdRecipesRawByStars.json()
                setCreatedRecipesByStars(createdRecipesByStars)


                const postedReviewsRaw = await fetch(`${import.meta.env.VITE_FETCH_URL}/postedreviews/${user.id}`, {
                    method:"GET",
                    headers:{'Content-Type':'application/json'}
                })
                const postedReviews = await postedReviewsRaw.json()
                setPostedReviews(postedReviews)

                setLoading(false)
            }
        )()
    }, [])

    function listRecipe(recipe){
        return <Link className="Link recipe" to={`/showcategory/${recipe.category}/recipe/${recipe.id}`}>
                <h2>{recipe.title}</h2>
                {recipe.img&&<div><img src={recipe.img.url}/></div>}
                {recipe.rating?<div>{recipe.rating}</div>:<div>no rating yet</div>}
            </Link>
    }

    function listReview(review){
        return <div className="review">
                    <h3><span>{review.writer.username}</span> {review.title}</h3>
                    <p>{review.description}</p>
                    <div className="fa fa-star" style={{color:"gold"}}>{review.rating} Stars </div>
            </div>
    }
    if (loading){
        return <h1>Loading...</h1>
    }
    // if (sortBy=="date"){
    //     alert(savedRecipesByStars[0].title)
    // }else{
    //     alert(savedRecipes[0].title)
    // }

    return <div>
        <h1>{user.username}</h1>
        {user.img?<img src={user.img.url}/>:<img src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg"/>}
        <h3>Saved recipes:</h3>
        <div className="sorting">Sort by:
            <div onClick={()=>setSortBy("rating")}>Rating</div>
            <div onClick={()=>setSortBy("date")}>Date</div>
        </div>
        {savedRecipesByStars.length>0?<div className="recipes">{sortBy=="date"?savedRecipes.map(recipe=>listRecipe(recipe)):savedRecipesByStars.map(recipe=>listRecipe(recipe))}</div>:<div>No saved recipes</div>}
        <h3>Created recipes:</h3>
        {createdRecipesByStars.length>0?<div className="recipes">{sortBy=="date"?createdRecipes.map(recipe=>listRecipe(recipe)):createdRecipesByStars.map(recipe=>listRecipe(recipe))}</div>:<div>No created recipes</div>}
        <h3>Posted Reviews:</h3>
        {postedReviews.length>0?postedReviews.map(review=>listReview(review)):<div>No Posted Reviews</div>}

    </div>
}

export default ShowProfile