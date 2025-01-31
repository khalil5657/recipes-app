import { Link, useOutletContext } from "react-router"

function Home(){
    const [user, setUser] = useOutletContext()
    return <div>
            <h1>Welcome home</h1>
        </div>
}

export default Home