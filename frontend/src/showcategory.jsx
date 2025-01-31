import { useEffect, useState } from "react"
import { Link, useOutletContext, useParams } from "react-router"

function ShowCategory(){
    const [user, setUser] = useOutletContext()
    const {type } = useParams()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState("")


    useEffect(()=>{
        (
            async ()=>{
                const rawData = await fetch(`${import.meta.env.VITE_FETCH_URL}/${type}/recipes`, {
                    method:"GET",
                    headers:{'Content-Type': 'application/json'}
                })
                const recipes = await rawData.json()
                setData(recipes.recipes)
                setLoading(false)
            }
        )()
    }, [type])

    function listIt(recipe){
        function list(item){
            return <li>{item}</li>
        }
        return <Link className="Link recipe" to={`/showcategory/${type}/recipe/${recipe.id}`}>
                <h2>{recipe.title}</h2>
                {recipe.img&&<div><img src={recipe.img.url}/></div>}
                {/* <p>{recipe.description}</p> */}
                {recipe.rating?<div>{recipe.rating}</div>:<div>no rating yet</div>}
                {/* <h2>Ingredients:</h2>
                <ul>
                    {recipe.ingredients.map(item=>list(item))}
                </ul>
                <h2>instructions:</h2>
                <ul>
                    {recipe.instructions.map(item=>list(item))}
                </ul> */}
            </Link>
    }

    if (loading){
        return <h1>Loading...</h1>
    }

    return <div>
            <h1>Recipes for {type}</h1>
            {data.length>0?<div className="recipes">{data.map(recipe=>listIt(recipe))}</div>:"no data yet"}
            <Link to={`/createrecipe/${type}`}>Create a {type} recipe</Link>
            
        </div>
}

export default ShowCategory