import { useState, useEffect } from "react"
import { useOutletContext, useParams } from "react-router"


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
                title,
                description,
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

    return <div>
            <form action="" onSubmit={addRecipe} encType="multipart/form-data">
                <label htmlFor="">title</label>
                <input type="text"  value={title} onChange={(e)=>setTitle(e.target.value)}/>
                <label htmlFor="">description</label>
                <textarea name="" id="" value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
                <label htmlFor="">image</label>
                <input type="file" name="picture" onChange={(e)=>setFile(e.target.files[0])}/>
                <label htmlFor="">ingredients</label>
                    <br />
                {listOfIngredients.map(item=><div>{item} <br /></div>)}
                <button onClick={(e)=>handleState(e)}>Add Ingredient</button>
                {showAddIngField&&
                                <div>
                                    <input value={ingredient} onChange={(e)=>setIngredient(e.target.value)}/>
                                    <button onClick={(e)=>addToLista(e)}>add</button>
                                </div>}
                <label htmlFor="">instructions</label>
                <br />
                {listOfInstructions.map(item=><div>{item} <br /></div>)}
                <button onClick={(e)=>handleInstState(e)}>Add Instruction</button>
                {showAddInstField&&
                                <div>
                                    <input value={instruction} onChange={(e)=>setInstruction(e.target.value)}/>
                                    <button onClick={(e)=>addToInstLista(e)}>add</button>
                                </div>}
                <label htmlFor="">Nutritius value</label>
                <input type="text" value={nutValue} onChange={(e)=>setNutValue(e.target.value)}/>
            <button type="submit">Add Recipe</button>
            </form>
        </div>
}

export default CreateRecipe