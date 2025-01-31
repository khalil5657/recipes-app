import { useEffect, useState } from "react"
import { Link, useLocation, useOutletContext } from "react-router"

function ShowSearchResults(){
    const [user, setUser] = useOutletContext()
    const {state} = useLocation()
    const [data, setData] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        (
            async ()=>{
                console.log(state.value)
                const recipesRaw = await fetch(`${import.meta.env.VITE_FETCH_URL}/search/${state.value}`, {
                    method:"GET",
                    headers:{"Content-Type":"application/json"}
                })
                const recipes = await recipesRaw.json()
                setData(recipes)
                setLoading(false)
            }
        )()
    }, [state])

    function listRecipe(recipe){
        return <Link className="Link recipe" to={`/showcategory/${recipe.category}/recipe/${recipe.id}`}>
                <h2>{recipe.title}</h2>
                {recipe.img&&<div><img src={recipe.img.url}/></div>}
                {recipe.rating?<div>{recipe.rating}</div>:<div>no rating yet</div>}
            </Link>
    }

    if (loading){
        return <h1>Loading...</h1>
    }

    return <div>
        {data.length>0?<div className="recipes">{data.map(recipe=>listRecipe(recipe))}</div>:<div>No results for: </div>}
        </div>
}

export default ShowSearchResults