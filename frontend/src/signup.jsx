import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router"

function SignUp(){
    const [user, setUser, setMessageContent, showMessage] = useOutletContext()
    const [file, setFile] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(()=>{
        ( async ()=>{
            if (user){
                return navigate("/")
            }
            setLoading(false)
        }
        )()
    }, [])
    

    function changeUsername(value){
        setUsername(value)
    }

    function changePassword(value){
        setPassword(value)
    }

    function handleFile(file){
        setFile(file)
    }

    async function signUp(e){
        e.preventDefault()

        const res = await fetch(`${import.meta.env.VITE_FETCH_URL}/signup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                useranme:username.trim(),
                password:password.trim(),
              })
        })
        const data = await res.json()

        if (file && data.username ){
            const theFile = file;
            const formData = new FormData();
            formData.append('image', theFile);
            const raw = await fetch(`${import.meta.env.VITE_FETCH_URL}/addprofileimage/`+data.id, {
            method: 'POST',
            body:formData
        })
        }

        if (data.username){
            setMessageContent("Review Added Succesfully")
            showMessage(true)
            return navigate("/login")
        }
    }
    if (loading){
        return <h1>Loading...</h1>
    }
    return <div className="signup">
            
            <div className="form-container">
                <h4>We're so excited to have you join us! </h4> 
                <h2>Sign Up</h2>
                <form onSubmit={signUp} encType="multipart/form-data">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                        type="text"
                        id="username"
                        onChange={(e)=>changeUsername(e.target.value)}
                        placeholder="Enter your username"
                        required/>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                        type="password"
                        id="password"
                        onChange={(e)=>changePassword(e.target.value)}
                        placeholder="Enter your password"
                        required/>
                    </div>
                    <h4>Choose Profile Picture</h4>
                    <input type="file" name="picture" onChange={(e)=>handleFile(e.target.files[0])} id="profile"/>
                    <br /><br />
                    <button type="submit">Sign Up</button>
                </form>
            </div>
    </div>
}

export default SignUp 