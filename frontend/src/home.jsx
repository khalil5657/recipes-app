import { useEffect, useState } from "react"
import { Link, useOutletContext } from "react-router"

function Home(){
    const [user, setUser] = useOutletContext()
    const [data, setData] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        (
            async ()=>{
                const rawRecipes = await fetch(`${import.meta.env.VITE_FETCH_URL}/recipes`, {
                    method:"GET",
                    headers: {'Content-Type': 'application/json'},
                })
                const recipes = await rawRecipes.json()
                setData(recipes)
                setLoading(false)
            }
        )()
    }, [])

    function listIt(recipe){
        return <Link className="Link recipe" to={`/showcategory/${recipe.category}/recipe/${recipe.id}`}>
                <h2>{recipe.title}</h2>
                {recipe.img&&<img src={recipe.img.url}/>}
                {recipe.rating?<div className="last-section">
                                    <div className="starsrating">
                                        <div className="fa fa-star" style={{color:"gold"}}> </div>
                                        <div> {recipe.rating} Stars </div>
                                    </div>
                                    <div className="calor">{recipe.nutvalue}c</div>
                                </div>
                            :<div>no rating yet</div>}
            </Link>
    }

    if (loading){
        return <h1>Loading...</h1>
    }

    return <div className="home">
            <h1>Welcome home</h1>
            <div className="homerecipes">
                {data.map(recipe=>listIt(recipe))}
            </div>
        </div>
}

export default Home