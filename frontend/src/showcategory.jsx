import { useEffect, useState } from "react"
import { Link, useOutletContext, useParams } from "react-router"

function ShowCategory(){
    const [user, setUser] = useOutletContext()
    const {type } = useParams()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState("")
    const [sortBy, setSortBy] = useState("rating")
    const [dataByRating, setDataByRating] = useState([])
    const [dataByDate, setDataBydate] = useState([])
    const [dataByCal, setDataByCal] = useState([])


    useEffect(()=>{
        (
            async ()=>{
                const rawData = await fetch(`${import.meta.env.VITE_FETCH_URL}/${type}/recipes/rating`, {
                    method:"GET",
                    headers:{'Content-Type': 'application/json'}
                })
                const recipes = await rawData.json()
                setDataByRating(recipes.recipes)

                const rawDataByDate = await fetch(`${import.meta.env.VITE_FETCH_URL}/${type}/recipes/date`, {
                    method:"GET",
                    headers:{'Content-Type': 'application/json'}
                })
                const recipesByDate = await rawDataByDate.json()
                setDataBydate(recipesByDate.recipes)

                const rawDataByCal = await fetch(`${import.meta.env.VITE_FETCH_URL}/${type}/recipes/cal`, {
                    method:"GET",
                    headers:{'Content-Type': 'application/json'}
                })
                const recipesByCal = await rawDataByCal.json()
                setDataByCal(recipesByCal.recipes)

                setLoading(false)
            }
        )()
    }, [type])

    function listIt(recipe){
        function list(item){
            return <li>{item}</li>
        }
        return <Link className="Link recipe" to={`/showcategory/${type}/recipe/${recipe.id}`}>
                <h2>{recipe.title} <span>{recipe.nutvalue}c</span></h2>
                {recipe.img&&<div><img src={recipe.img.url}/></div>}
                {recipe.rating?<div>{recipe.rating}</div>:<div>no rating yet</div>}
            </Link>
    }

    if (loading){
        return <h1>Loading...</h1>
    }

    return <div>
            <h1>Recipes for {type}</h1>
            <div className="sorting">Sort by:
                <div onClick={()=>setSortBy("rating")}>Rating {sortBy=="rating"&&<span>✓</span>}</div>
                <div onClick={()=>setSortBy("date")}>Date {sortBy=="date"&&<span>✓</span>}</div>
                <div onClick={()=>setSortBy("calories")}>Calories {sortBy=="calories"&&<span>✓</span>}</div>
            </div>
            {dataByDate.length>0?<div className="recipes">{sortBy=="rating"?dataByRating.map(recipe=>listIt(recipe)):sortBy=="calories"?dataByCal.map(recipe=>listIt(recipe)):dataByDate.map(recipe=>listIt(recipe))}</div>:"no data yet"}
            {user.username&&<Link to={`/createrecipe/${type}`}>Create a {type} recipe</Link>}
            
        </div>
}

export default ShowCategory