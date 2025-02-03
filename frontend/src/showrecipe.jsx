import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext, useParams } from "react-router"

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
    const [reviewsIds, setReviewsIds] = useState([])
    const [update, setUpdate] = useState("")
    const navigate =  useNavigate()
    const [editReviewField, setEditReviewField] = useState("n")
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription]  = useState("")
    const [editStars, setEditStars] = useState(0)
    const [editStarsFinal, setEditStarsFinal] = useState(0)
    const [editAllow, setEditAllow] = useState(true)
    useEffect(()=>{
        (
            async ()=>{
                const rawData = await fetch(`${import.meta.env.VITE_FETCH_URL}/recipe/${id}`, {
                    method:"GET",
                    headers:{'Content-Type': 'application/json'}
                })
                const recipe = await rawData.json()
                setData(recipe)
                let reviewsIds = []
                recipe.reviews.map(review=>reviewsIds.push(review.writerid))
                setReviewsIds(reviewsIds)
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

    async function saveRecipe(){
        await fetch(`${import.meta.env.VITE_FETCH_URL}/saverecipe`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                userid:user.id,
                recipeid:id
              })
        })
        setUpdate({})
    }

    async function deleteSavedRecipe(){
        await fetch(`${import.meta.env.VITE_FETCH_URL}/deletesavedrecipe`, {
            method:"DELETE",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                userid:user.id,
                recipeid:id
              })
        })
        setUpdate({})
    }

    function showIt(recipe){
        // gets the recipe and show all its contents

        function showReview(review, index){
            // shows each review

            function editIt(index){
                // toggle edit review form
                setEditStars(review.rating)
                if (editReviewField!=undefined&&editReviewField!="n"){
                    setEditReviewField('n')                    
                }else{
                    setEditTitle(review.title)
                    setEditDescription(review.description)
                    setEditReviewField(index)
                    setEditStarsFinal(review.rating)
                    setEditAllow(false)
                }

            }
            
            function handleEditStars(num){
                // set stars to help hovering
                if (editAllow==true){
                    setEditStars(num)
                }
            }

            function handleEditFinalStars(num){
                // seting final stars to push to backend
                if (editAllow==true){
                    setEditStarsFinal(num)
                    setEditAllow(false)
                }else{
                    setEditStarsFinal(0)
                    setEditAllow(true)
                }
                
            }

            async function updateReview(e){
                // calling backend to edit review 
                e.preventDefault()
                await fetch(`${import.meta.env.VITE_FETCH_URL}/editreview/${review.id}`, {
                    method:"PUT",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({
                        recipeid:recipe.id,
                        title:editTitle,
                        description:editDescription,
                        rating:editStarsFinal
                    })
                })
                setEditReviewField('n')
                setUpdate({})
            }

            return <div className="review">
                    {/* if the editreviewfield doesnt equal the index of the current review show the review normally */}
                    {editReviewField!=index?
                    <div>
                        <h3><span>{review.writer.username}</span> {review.title}</h3>
                        <p>{review.description}</p>
                        <div className="fa fa-star" style={{color:"gold"}}>{review.rating} Stars </div>
                    </div>
                    :<div>
                        <form action="" onSubmit={updateReview}> 
                            <label>Review Title:</label>
                            <input type="text" value={editTitle} onChange={(e)=>setEditTitle(e.target.value)}/>
                            <label htmlFor="">Review Description: </label>
                            <textarea name="" id="" value={editDescription} onChange={(e)=>setEditDescription(e.target.value)}></textarea>
                            <label htmlFor="">Rating</label>
                            <div className="stars">
                                <div onMouseEnter={()=>handleEditStars(1)} onMouseLeave={()=>handleEditStars(0)} onClick={()=>handleEditFinalStars(1)} className={editStars>=1?"fa fa-star checked":'fa fa-star'}></div>
                                <div onMouseEnter={()=>handleEditStars(2)} onMouseLeave={()=>handleEditStars(0)} onClick={()=>handleEditFinalStars(2)}  className={editStars>=2?"fa fa-star checked":"fa fa-star"}></div>
                                <div onMouseEnter={()=>handleEditStars(3)} onMouseLeave={()=>handleEditStars(0)} onClick={()=>handleEditFinalStars(3)}  className={editStars>=3?"fa fa-star checked":'fa fa-star'}></div>
                                <div onMouseEnter={()=>handleEditStars(4)} onMouseLeave={()=>handleEditStars(0)} onClick={()=>handleEditFinalStars(4)}  className={editStars>=4?"fa fa-star checked":'fa fa-star'}></div>
                                <div onMouseEnter={()=>handleEditStars(5)} onMouseLeave={()=>handleEditStars(0)} onClick={()=>handleEditFinalStars(5)}  className={editStars>=5?"fa fa-star checked":'fa fa-star'}></div>
                            </div>
                            {editStarsFinal}
                            <button type="submit">Update</button>
                        </form>
                    </div>}
                    {/* show edit and delete buttons to reviews created by you */}
                    {review.writerid==user.id&&<div><button onClick={()=>deleteReview(review.id)}>Delete</button><button onClick={()=>editIt(index)}>Edit</button></div>}
                </div>

        }

        async function deleteReview(id){
            // gets the id of review and calls backend to delete it
            await fetch(`${import.meta.env.VITE_FETCH_URL}/deletereview/${id}`, {
                method:"DELETE",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    recipeid:recipe.id
                  })
            })
            setUpdate({})
        }

        function list(item){
            // show ingredient or instruction on list tag
            return <li>{item}</li>
        }

        return <div >
                <h2>{recipe.title}</h2>
                {!user.username?'':!recipe.userswhosaved.includes(user.id)?<button onClick={()=>saveRecipe()}>Save the Recipe</button>:<button onClick={()=>deleteSavedRecipe()}>remove from saved</button>}
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
                {recipe.writerid==user.id&&<Link to={`/editrecipe/${recipe.id}`} state={{recipe:recipe}}>Edit</Link>}
                {recipe.writerid==user.id&&<button onClick={(e)=>deleteRecipe(e, recipe)}>Delete</button>}

                <h2>Reviews:</h2>
                {recipe.reviews.length>0&&recipe.reviews.map((review, index)=>showReview(review, index))}
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
        setShowReviewFormState(false)
        setUpdate({})
    }
    if (loading){
        return <h1>Loading...</h1>
    }

    async function deleteRecipe(e, recipe){
        e.preventDefault()
        await fetch(`${import.meta.env.VITE_FETCH_URL}/deleterecipe/${recipe.id}`, {
            method:"DELETE",
            headers:{"Content-Type":"application/json"},
        })
        return navigate("/")
    }

    return <div>
            {showIt(data)}
            {!user.username?'':(!reviewsIds.includes(user.id))?<button onClick={(e)=>handleShowForm(e)}>Add review</button>:<div>You Already added a review</div>}
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