import { useEffect, useState } from "react"
import { Link, useOutletContext, useParams } from "react-router"

function ShowRecipe(){
    const [user, setUser] = useOutletContext()
    const {type, id } = useParams()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState("")
    const [reviewTitle, setReviewTitle] = useState("")
    const [reviewDescription, setReviewDescription] = useState("")
    const [showReviewFormState, setShowReviewFormState] = useState(false)
    const [stars, setStars] = useState(0)
    const [starsFinal, setStarsFinal] = useState(0)
    const [allow, setAllow] = useState(true)
    const [update, setUpdate] = useState("")

    useEffect(()=>{
        (
            async ()=>{
                const rawData = await fetch(`${import.meta.env.VITE_FETCH_URL}/recipe/${id}`, {
                    method:"GET",
                    headers:{'Content-Type': 'application/json'}
                })
                const recipe = await rawData.json()
                setData(recipe)
                setLoading(false)
            }
        )()
    }, [type, update])

    function handleShowForm(e){
        e.preventDefault()
        if (showReviewFormState==true){
            setShowReviewFormState(false)
        }else{
            setShowReviewFormState(true)
        }
    }

    function postIt(e){
        e.preventDefault()
    }

    function showIt(recipe){
        function list(item){
            return <li>{item}</li>
        }
        return <div >
                <h2>{recipe.title}</h2>
                {recipe.img&&<div><img src={recipe.img.url}/></div>}
                <p>{recipe.description}</p>
                {recipe.rating?<div className="fa fa-star" style={{color:"gold"}}>{recipe.rating} Stars </div>:<div>no rating yet</div>}
                <h2>Ingredients:</h2>
                <ul>
                    {recipe.ingredients.map(item=>list(item))}
                </ul>
                <h2>instructions:</h2>
                <ul>
                    {recipe.instructions.map(item=>list(item))}
                </ul>
                {recipe.reviews.length}
            </div>
    }

    function handleSetStars(num){
        if (allow==true){
            setStars(num)
        }
    }

    function handleFinalStars(num){
        if (allow==true){
            setStarsFinal(num)
            setAllow(false)
        }else{
            setStarsFinal(0)
            setAllow(true)
        }
        
    }
    async function sendReview(e) {
        e.preventDefault()
        await fetch(`${import.meta.env.VITE_FETCH_URL}/review`, {
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
                title:reviewTitle,
                description:reviewDescription,
                rating:starsFinal,
                writerid:user.id,
                recipeid:data.id
              })
        })
        setUpdate({})
    }
    if (loading){
        return <h1>Loading...</h1>
    }

    return <div>
            {showIt(data)}
            <button onClick={(e)=>handleShowForm(e)}>Add review</button>
            {showReviewFormState&&
            <form onSubmit={sendReview}>
                <label htmlFor="">Review Title</label>
                <input type="text" value={reviewTitle} onChange={(e)=>setReviewTitle(e.target.value)}/>
                <label htmlFor="">review description</label>
                <textarea name="" id="" value={reviewDescription} onChange={(e)=>setReviewDescription(e.target.value)}></textarea>
                <label htmlFor="">Rating</label>
                <div className="stars">
                    <div onMouseEnter={()=>handleSetStars(1)} onMouseLeave={()=>handleSetStars(0)} onClick={()=>handleFinalStars(1)} className={stars>=1?"fa fa-star checked":'fa fa-star'}></div>
                    <div onMouseEnter={()=>handleSetStars(2)} onMouseLeave={()=>handleSetStars(0)} onClick={()=>handleFinalStars(2)}  className={stars>=2?"fa fa-star checked":"fa fa-star"}></div>
                    <div onMouseEnter={()=>handleSetStars(3)} onMouseLeave={()=>handleSetStars(0)} onClick={()=>handleFinalStars(3)}  className={stars>=3?"fa fa-star checked":'fa fa-star'}></div>
                    <div onMouseEnter={()=>handleSetStars(4)} onMouseLeave={()=>handleSetStars(0)} onClick={()=>handleFinalStars(4)}  className={stars>=4?"fa fa-star checked":'fa fa-star'}></div>
                    <div onMouseEnter={()=>handleSetStars(5)} onMouseLeave={()=>handleSetStars(0)} onClick={()=>handleFinalStars(5)}  className={stars>=5?"fa fa-star checked":'fa fa-star'}></div>
                </div>
                {starsFinal}
                <button type="submit">post</button>
            </form>}
        </div>
}

export default ShowRecipe