import { useState, useEffect } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router"


function CreateRecipe(){
    const [user, setUser] = useOutletContext()
    const {type } = useParams()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [nutValue, setNutValue] = useState("")
    const [ingredient, setIngredient]= useState("")
    const [instruction, setInstruction] = useState("")
    const [listOfIngredients, setListOfIngredients] = useState([])
    const [listOfInstructions, setListOfInstructions] = useState([])
    const [showAddIngField, setShowAddIngField] = useState(false)
    const [showAddInstField, setShowAddInstField] = useState(false)
    const [file, setFile] = useState("")
    const navigate =  useNavigate()

    useEffect(()=>{
        (
            async ()=>{
                if (!user.username){
                    return navigate("/")
                }
                setLoading(false)
            }
        )()
    }, [])

    function handleInstState(e){
        e.preventDefault()
        if (showAddInstField==false){
            setShowAddInstField(true)
        }else{
            setShowAddInstField(false)
        }
    }

    function handleState(e){
        e.preventDefault()
        if (showAddIngField==false){
            setShowAddIngField(true)
        }else{
            setShowAddIngField(false)
        }
    }

    function addToLista(e){
        e.preventDefault()
        const thelist = listOfIngredients
        thelist[thelist.length] = ingredient
        setListOfIngredients(thelist)
        setShowAddIngField(false)
        setIngredient("")
    }

    function addToInstLista(e){
        e.preventDefault()
        const thelist = listOfInstructions
        thelist[thelist.length] = instruction
        setListOfInstructions(thelist)
        setShowAddInstField(false)
        setInstruction("")
    }

    async function addRecipe(e){
        e.preventDefault()
        const rawData = await fetch(`${import.meta.env.VITE_FETCH_URL}/recipe/${type}`, {
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title:title.trim(),
                description:description.trim(),
                writerid:user.id,
                ingredients:listOfIngredients,
                instructions:listOfInstructions,
                nutvalue:nutValue
              })
        })
        const data = await rawData.json()

        if (file && data.title ){
            const theFile = file;
            const formData = new FormData();
            formData.append('image', theFile);
            const raw = await fetch(`${import.meta.env.VITE_FETCH_URL}/addrecipeimage/`+data.id, {
            method: 'POST',
            body:formData
        })
        }
    }

    if (loading){
        return <h1>Loading...</h1>
    }

    return <div className="createrecipe-container">
            <form action="" onSubmit={addRecipe} encType="multipart/form-data">
                <label htmlFor="">title</label>
                <input type="text"  value={title} onChange={(e)=>setTitle(e.target.value)} required/>
                <label htmlFor="">description</label>
                <textarea name="" id="" value={description} onChange={(e)=>setDescription(e.target.value)} rows={8} required></textarea>
                <label htmlFor="">image</label>
                <input type="file" name="picture" onChange={(e)=>setFile(e.target.files[0])} />
                <label htmlFor="">ingredients: </label>
                <ul>{listOfIngredients.map(item=><li>{item}</li>)}</ul>
                <button onClick={(e)=>handleState(e)} className="adding">Add Ingredient</button>
                {showAddIngField&&
                                <div className="adding-container">
                                    <input value={ingredient} onChange={(e)=>setIngredient(e.target.value)}/>
                                    <button onClick={(e)=>addToLista(e)}>add</button>
                                </div>}
                <label htmlFor="">instructions: </label>
                <ul>{listOfInstructions.map(item=><li>{item} </li>)}</ul>
                <button onClick={(e)=>handleInstState(e)} className="addins">Add Instruction</button>
                {showAddInstField&&
                                <div className="addins-container">
                                    <input value={instruction} onChange={(e)=>setInstruction(e.target.value)}/>
                                    <button onClick={(e)=>addToInstLista(e)}>add</button>
                                </div>}
                <label htmlFor="">Nutritius value</label>
                <input type="number" value={nutValue} onChange={(e)=>setNutValue(e.target.value)}/>
            <button type="submit" className="addrecipebtn">Add Recipe</button>
            </form>
        </div>
}

export default CreateRecipe