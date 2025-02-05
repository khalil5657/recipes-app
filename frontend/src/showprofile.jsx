import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router"

function ShowProfile(){
    const [user, setUser] = useOutletContext()
    const [loading, setLoading] = useState(true)
    const [savedRecipes, setSavedRecipes] = useState([])
    const [createdRecipes, setCreatedRecipes] = useState([])
    const [postedReviews, setPostedReviews] = useState([])
    const [savedRecipesByStars, setSavedRecipesByStars] = useState([])
    const [createdRecipesByStars, setCreatedRecipesByStars] = useState([])
    const [savedRecipesByCal, setSavedRecipesByCal] = useState([])
    const [createdRecipesByCal, setCreatedRecipesByCal] = useState([])
    const [sortBy, setSortBy] = useState("rating")
    const navigate = useNavigate()

    useEffect(()=>{
        (
            async ()=>{
                if (!user){
                    return navigate("/")
                }
                const savedRecipesRaw = await fetch(`${import.meta.env.VITE_FETCH_URL}/savedrecipes/${user.id}/date`, {
                    method:"GET",
                    headers:{'Content-Type':'application/json'}
                })
                const savedRecipes = await savedRecipesRaw.json()
                setSavedRecipes(savedRecipes)
                console.log(savedRecipes, 'plp')
                //// the recipes by stars rating
                const savedRecipesRawByStars = await fetch(`${import.meta.env.VITE_FETCH_URL}/savedrecipes/${user.id}/rating`, {
                    method:"GET",
                    headers:{'Content-Type':'application/json'}
                })
                const savedRecipesByStars = await savedRecipesRawByStars.json()
                setSavedRecipesByStars(savedRecipesByStars)
                console.log(savedRecipesByStars, 'plp1')
                /// the recipes by calories
                const savedRecipesRawByCal = await fetch(`${import.meta.env.VITE_FETCH_URL}/savedrecipes/${user.id}/cal`, {
                    method:"GET",
                    headers:{'Content-Type':'application/json'}
                })
                const savedRecipesByCal = await savedRecipesRawByCal.json()
                setSavedRecipesByCal(savedRecipesByCal)
                console.log(savedRecipesByCal, 'pj')



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
                //// recipes by calories
                const createdRecipesRawByCal = await fetch(`${import.meta.env.VITE_FETCH_URL}/createdrecipes/${user.id}/cal`, {
                    method:"GET",
                    headers:{'Content-Type':'application/json'}
                })
                const createdRecipesByCal = await createdRecipesRawByCal.json()
                setCreatedRecipesByCal(createdRecipesByCal)



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
                {recipe.rating?
                <div className="last-section">
                                    <div className="starsrating">
                                        <div className="fa fa-star" style={{color:"gold"}}> </div>
                                        <div> {recipe.rating} Stars </div>
                                    </div>
                                    <div className="calor">{recipe.nutvalue}c</div>
                                </div>
                :<div className="last-section">
                        <div>no rating yet</div>
                        <div className="calor">{recipe.nutvalue}c</div>
                    </div>}
            </Link>
    }

    function listReview(review){
        return <div className="review">
                    <h3><span>{review.writer.username}</span> {review.title}</h3>
                    <p>{review.description}</p>
                    <div className="fa fa-star" style={{color:"gold"}}>{review.rating} Stars </div>
                    
            </div>
    }

    function showReview(review){
            // shows each review             

            return <div className="review-container">
                    {/* if the editreviewfield doesnt equal the index of the current review show the review normally */}
                    
                    <div className="review">
                        <div className="reviewprofile">
                            {review.writer.img?<img src={review.writer.img.url} alt="" />:<img src='https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg'/>}
                            <div >
                                <div>{review.writer.username}</div>
                                <div className="fa fa-star" style={{color:"gold"}}>{review.rating} Stars </div>
                            </div>
                        </div>
                        <div className="reviewcontent">
                            <h5>{review.title}</h5>
                            <p>{review.description}</p>
                        </div>
                    </div>
                    {/* show edit and delete buttons to reviews created by you */}
                </div>

    }

    if (loading){
        return <h1>Loading...</h1>
    }

    return <div className="showprofile" style={{padding:"60px"}}>
        <div className="profile">
            <h1>{user.username}</h1>
            {user.img?<img src={user.img.url}/>:<img src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg"/>}

        </div>
        <div className="sorting">Sort by:
            <div onClick={()=>setSortBy("rating")}>Rating {sortBy=="rating"&&<span>✓</span>}</div>
            <div onClick={()=>setSortBy("date")}>Date {sortBy=="date"&&<span>✓</span>}</div>
            <div onClick={()=>setSortBy("calories")}>Calories {sortBy=="calories"&&<span>✓</span>}</div>

        </div>
        <h3>Saved recipes:</h3>
        {savedRecipesByStars.length>0?<div className="recipes">{sortBy=="date"?savedRecipes.map(recipe=>listRecipe(recipe)):sortBy=="calories"?savedRecipesByCal.map(recipe=>listRecipe(recipe)):savedRecipesByStars.map(recipe=>listRecipe(recipe))}</div>:<div>No saved recipes</div>}
        <h3>Created recipes:</h3>
        {createdRecipesByStars.length>0?<div className="recipes">{sortBy=="date"?createdRecipes.map(recipe=>listRecipe(recipe)):sortBy=="calories"?createdRecipesByCal.map(recipe=>listRecipe(recipe)):createdRecipesByStars.map(recipe=>listRecipe(recipe))}</div>:<div>No created recipes</div>}
        <h3>Posted Reviews:</h3>
        {postedReviews.length>0?postedReviews.map(review=>showReview(review)):<div>No Posted Reviews</div>}

    </div>
}

export default ShowProfile