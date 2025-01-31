import { useState, useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router"

function Login(){
    const [user, setUser] = useOutletContext()
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

    async function login(e) {
        e.preventDefault()
        const rawUser = await fetch(`${import.meta.env.VITE_FETCH_URL}/login`, {
            method:"POST",
            headers: {'Content-Type': 'application/json'},
            credentials:"include",
            body: JSON.stringify({
                username,
                password,
              })
        })
        const loggedUser = await rawUser.json()
        if (loggedUser.username){
            setUser(loggedUser)
            return navigate("/")
        }else{
            console.log(loggedUser.message)
        }
    }

    if (loading){
        return <h1>Loading...</h1>
    }
    return <div>
            <h1>Login now!!</h1>
            <form action="" onSubmit={login}>
                <label htmlFor="">Username</label>
                <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                <label htmlFor="">Password</label>
                <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button type="submit">Login</button>
            </form>
        </div>
}

export default Login