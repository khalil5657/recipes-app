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
                <h2>{recipe.title} <span>{recipe.nutvalue}c</span></h2>
                {recipe.img&&<div><img src={recipe.img.url}/></div>}
                {recipe.rating?<div>{recipe.rating}</div>:<div>no rating yet</div>}
                {recipe.nutvalue}
            </Link>
    }

    if (loading){
        return <h1>Loading...</h1>
    }

    return <div>
            <div className="sorting">Sort by:
                <div onClick={()=>setSortBy("rating")}>Rating {sortBy=="rating"&&<span>✓</span>}</div>
                <div onClick={()=>setSortBy("date")}>Date {sortBy=="date"&&<span>✓</span>}</div>
                <div onClick={()=>setSortBy("calories")}>Calories{sortBy=="calories"&&<span>✓</span>}</div>
            </div>
            {dataByDate.length>0?<div className="recipes">{sortBy=="rating"?dataByRating.map(recipe=>listRecipe(recipe)):dataByDate.map(recipe=>listRecipe(recipe))}</div>:<div>No results for: {state.value}</div>}
        {/* {data.length>0?<div className="recipes">{data.map(recipe=>listRecipe(recipe))}</div>:<div>No results for: </div>} */}
        </div>
}

export default ShowSearchResults