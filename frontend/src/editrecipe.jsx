import { useState, useEffect } from "react"
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router"


function EditRecipe(){
    const [user, setUser] = useOutletContext()
    const {id} = useParams()
    const {state} = useLocation()
    const [loading, setLoading] = useState(true)

    const [title, setTitle] = useState(state?state.recipe.title:'')
    const [description, setDescription] = useState(state?state.recipe.description:'')
    const [nutValue, setNutValue] = useState(state?state.recipe.nutvalue:'')
    /// edit old one
    const [ingredient, setIngredient]= useState('')
    const [instruction, setInstruction] = useState('')
    // add new one
    const [newIngredient, setNewIngredient]= useState('')
    const [newInstruction, setNewInstruction] = useState('')
    // show input to add new one
    const [showAddNewIngField, setShowAddNewIngField] = useState(false)
    const [showAddNewInstField, setShowAddNewInstField] = useState(false)

    const [listOfIngredients, setListOfIngredients] = useState(state?state.recipe.ingredients:'')
    const [listOfInstructions, setListOfInstructions] = useState(state?state.recipe.instructions:'')

    // show input to edit old one
    const [showEditIngField, setShowEditIngField] = useState('n')
    const [showEditInsField, setShowEditInsField] = useState('n')

    const [oldImgUrl, setOldImgUrl] = useState(state?state.recipe.img.url:"")
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

    function handleSetFile(value){
        setFile(value)
        setOldImgUrl("")
    }

    function handleInstState(e){
        e.preventDefault()
        if (showAddNewInstField==false){
            setShowAddNewInstField(true)
        }else{
            setShowAddNewInstField(false)
        }
    }

    function handleState(e){
        e.preventDefault()
        if (showAddNewIngField==false){
            setShowAddNewIngField(true)
        }else{
            setShowAddNewIngField(false)
        }
    }

    function addToLista(e){
        e.preventDefault()
        const thelist = listOfIngredients
        thelist[thelist.length] = newIngredient
        setListOfIngredients(thelist)
        setShowAddNewIngField(false)
        setNewIngredient("")
    }

    function addToInstLista(e){
        e.preventDefault()
        const thelist = listOfInstructions
        thelist[thelist.length] = newInstruction
        setListOfInstructions(thelist)
        setShowAddNewInstField(false)
        setNewInstruction("")
    }

    async function updateRecipe(e){
        e.preventDefault()
        const rawData = await fetch(`${import.meta.env.VITE_FETCH_URL}/editrecipe/${id}`, {
            method:"PUT",
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
            const raw = await fetch(`${import.meta.env.VITE_FETCH_URL}/editrecipeimage/`+data.id, {
            method: 'POST',
            body:formData
        })
        }
    }

    function listIngr(item, index){
        // list ingredient
        function deletIt(index){
            var newList = listOfIngredients.slice();
            // let newList = listOfIngredients
            newList.splice(index, 1)
            setListOfIngredients(newList)
            setShowEditIngField("n")
        }
        function editIt(index){
            setIngredient(item)
            setShowEditIngField(index)
        }

        function updateIt(index){
            var newList = listOfIngredients.slice();
            newList.splice(index, 1, ingredient)
            setListOfIngredients(newList)
            setIngredient("")
            setShowEditIngField("n")
        }

        return <li >
                    {item}
                    <button type="button" onClick={()=>deletIt(index)}>delete</button>
                    <button type="button" onClick={()=>editIt(index)}>Edit</button>
                    {/* if showeditingfield eqals index of the current ingredient show the form to update  */}
                    {showEditIngField==index&&<div><input value={ingredient} onChange={(e)=>setIngredient(e.target.value)}/><button onClick={()=>updateIt(index)}>Update</button></div>}
            </li>
    }

    function listInst(item, index){
        // list instruction
        function deletIt(index){
            var newList = listOfInstructions.slice();
            // let newList = listOfInstructions
            newList.splice(index, 1)
            setListOfInstructions(newList)
            setShowEditInsField("n")
        }
        function editIt(index){
            setInstruction(item)
            setShowEditInsField(index)
        }

        function updateIt(index){
            var newList = listOfInstructions.slice();
            newList.splice(index, 1, instruction)
            setListOfInstructions(newList)
            setInstruction('')
            setShowEditInsField('n')
        }

        return <li >
                    {item}
                    <button type="button" onClick={()=>deletIt(index)}>delete</button>
                    <button type="button" onClick={()=>editIt(index)}>Edit</button>
                    {/* if showeditinsfield eqals index of the current instruction show the form to update  */}
                    {showEditInsField==index&&<div><input value={instruction} onChange={(e)=>setInstruction(e.target.value)}/><button type="button" onClick={()=>updateIt(index)}>Update</button></div>}
                </li>

    }

    if (loading){
        return <h1>Loading...</h1>
    }

    return <div className="editrecipe-container">
            <form action="" onSubmit={updateRecipe} encType="multipart/form-data">
                <label htmlFor="">title</label>
                <input type="text"  value={title} onChange={(e)=>setTitle(e.target.value)} required/>
                {oldImgUrl&&<img src={oldImgUrl}/>}
                <label htmlFor="">description</label>
                <textarea name="" id="" value={description} onChange={(e)=>setDescription(e.target.value)} rows={8} required></textarea>
                <label htmlFor="">image</label>
                <input type="file" name="picture" onChange={(e)=>handleSetFile(e.target.files[0])}/>
                <label htmlFor="">ingredients: </label>
                {listOfIngredients.map((item, index)=><div>{listIngr(item, index)} </div>)}
                <button onClick={(e)=>handleState(e)}className="adding">Add Ingredient</button>
                {showAddNewIngField&&
                                <div className="adding-container">
                                    <input value={newIngredient} onChange={(e)=>setNewIngredient(e.target.value)}/>
                                    <button onClick={(e)=>addToLista(e)}>add</button>
                                </div>}
                <label htmlFor="">instructions</label>
                {listOfInstructions.map((item, index)=><div>{listInst(item, index)}</div>)}
                <button onClick={(e)=>handleInstState(e)} className="addins">Add Instruction</button>
                {showAddNewInstField&&
                                <div className="addins-container">
                                    <input value={newInstruction} onChange={(e)=>setNewInstruction(e.target.value)}/>
                                    <button onClick={(e)=>addToInstLista(e)}>add</button>
                                </div>}
                <label htmlFor="">Nutritius value</label>
                <input type="number" value={nutValue} onChange={(e)=>setNutValue(e.target.value)}/>
            <button type="submit" className="addrecipebtn">Update Recipe</button>
            </form>
        </div>
}

export default EditRecipe