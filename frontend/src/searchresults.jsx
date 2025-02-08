import { useEffect, useState } from "react"
import { Link, useLocation, useOutletContext } from "react-router"

function ShowSearchResults(){
    const [user, setUser] = useOutletContext()
    const {state} = useLocation()
    const [data, setData] = useState("")
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState("rating")
    const [dataByRating, setDataByRating] = useState([])
    const [dataByDate, setDataBydate] = useState([])
    const [dataByCal, setDataByCal] = useState([])


    useEffect(()=>{
        (
            async ()=>{
                console.log(state.value)
                const recipesRaw = await fetch(`${import.meta.env.VITE_FETCH_URL}/search/${state.value}/rating`, {
                    method:"GET",
                    headers:{"Content-Type":"application/json"}
                })
                const recipes = await recipesRaw.json()
                setDataByRating(recipes)

                const recipesRawByDate = await fetch(`${import.meta.env.VITE_FETCH_URL}/search/${state.value}/date`, {
                    method:"GET",
                    headers:{"Content-Type":"application/json"}
                })
                const recipesByDate = await recipesRawByDate.json()
                setDataBydate(recipesByDate)

                const recipesRawByCal = await fetch(`${import.meta.env.VITE_FETCH_URL}/search/${state.value}/cal`, {
                    method:"GET",
                    headers:{"Content-Type":"application/json"}
                })
                const recipesByCal = await recipesRawByCal.json()
                setDataByCal(recipesByCal)

                setLoading(false)
            }
        )()
    }, [state])

    function listRecipe(recipe){
        return <Link className="Link recipe" to={`/showcategory/${recipe.category}/recipe/${recipe.id}`}>
                <h2>{recipe.title} </h2>
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

    if (loading){
        return <h1 className="loading">Loading...</h1>
    }

    return <div className="showsearch">
            <div style={{paddingLeft:"60px", paddingRight:"60px", paddingTop:"20px"}}>
                <h1>Search Results for "{state.value}"</h1>
                <div className="sorting">Sort by:
                    <div onClick={()=>setSortBy("rating")}>Rating {sortBy=="rating"&&<span>✓</span>}</div>
                    <div onClick={()=>setSortBy("date")}>Date {sortBy=="date"&&<span>✓</span>}</div>
                    <div onClick={()=>setSortBy("calories")}>Calories{sortBy=="calories"&&<span>✓</span>}</div>
                </div>
            </div>
            
            {dataByDate.length>0?<div className="recipes">{sortBy=="rating"?dataByRating.map(recipe=>listRecipe(recipe)):sortBy=="date"?dataByDate.map(recipe=>listRecipe(recipe)):dataByCal.map(recipe=>listRecipe(recipe))}</div>:<div>No results for: {state.value}</div>}
        </div>
}

export default ShowSearchResults