import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router"

function SignUp(){
    const [user, setUser] = useOutletContext()
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
                username,
                password,
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
            return navigate("/login")
        }
    }
    if (loading){
        return <h1>Loading...</h1>
    }
    return <div className="signup">
            {/* <h1>Create Account</h1> */}
            {/* <form method="post" onSubmit={signUp} encType="multipart/form-data">
                <label htmlFor="">Username</label>
                <input type="text" placeholder="Call me ..." value={username} onChange={(e)=>changeUsername(e.target.value)}/>
                <label htmlFor="">Password</label>
                <input type="password" value={password} onChange={(e)=>changePassword(e.target.value)}/>
                <h1>Choose Profile Picture</h1>
                <input type="file" name="picture" onChange={(e)=>handleFile(e.target.files[0])}/>
                <br /><button type="submit">Create</button>
            </form>  */}
            <div className="form-container">
                <h4>We're so excited to have you join us! </h4> 
                <h2>Sign Up</h2>
                <form onSubmit={signUp} encType="multipart/form-data">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                        type="text"
                        id="username"
                        onChange={(e)=>setUsername(e.target.value)}
                        placeholder="Enter your username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                        type="password"
                        id="password"
                        onChange={(e)=>setPassword(e.target.value)}
                        placeholder="Enter your password"
                        />
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