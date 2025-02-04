import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { RouterProvider, createBrowserRouter, Outlet, Link, useNavigate } from 'react-router-dom'
import Home from './home'
import SignUp from './signup'
import Login from './login'
import ShowCategory from './showcategory'
import CreateRecipe from './createrecipe'
import ShowRecipe from './showrecipe'
import ShowProfile from './showprofile'
import ShowSearchResults from './searchresults'
import EditRecipe from './editrecipe'

function RootLayout(){
  const [user, setUser] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")

  useEffect(()=>{
    (
      async () =>{
        const response = await fetch(`${import.meta.env.VITE_FETCH_URL}/user`, {
          method:"GET",
          headers:{"Content-Type":"application/json"},
          credentials:"include"
        })
        const contentraw = await response.json()
        const content = contentraw.username
        if (content){
          setUser(contentraw)
        }
        setLoading(false)
      }
    )()
  }, [])

  async function logOut(){
    await fetch(`${import.meta.env.VITE_FETCH_URL}/logout`, {
      method:"POST",
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    setUser("")
    return navigate("/")
  }

  if (loading){
    return <h1>Loading...</h1>
  }
  return <div>
          <nav>
            <Link className='navhome'>Home</Link>
            <div className='categories'>
              categories
              <div className="catitems">
                <Link className='Link' to="/showcategory/pizza">Pizza</Link>
                <Link className='Link' to="/showcategory/burger">Burger</Link>
                <Link className='Link' to="/showcategory/soup">Soup</Link>
                <Link className='Link' to="/showcategory/sea food">Sea food</Link>
                <Link className='Link' to="/showcategory/pasta&noodles">Pasta/Noodles</Link>
              </div>
            </div>
            <div className="navsearch">
              <input type="text" placeholder='search' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}/>
              <Link className='Link' to="/searchresults" state={{value:searchValue}}>Search</Link>
            </div>
            {!user&&<div><Link to="/login">Login</Link><Link to="/signup">Signup</Link></div>}
            {user&&<div><Link className='Link' to="/showprofile">{user.img?<img src={user.img.url} className='profile-img'/>:<img src='https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg' className='profile-img'/>}{user.username} {user.id=="a123170a-59c4-412f-b803-ddb539deb658"&&'Admin'}</Link><button onClick={logOut}>Logout</button></div>}
          </nav>
          <Outlet context={[user, setUser]}/>
      </div>
}


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children:[
      {
        path:"/",
        element:<Home />
      },
      {
        path:"/signup",
        element:<SignUp />
      },
      {
        path:"/login",
        element:<Login />
      },
      {
        path:"/showcategory/:type",
        element:<ShowCategory />
      },
      {
        path:"/showcategory/:type/recipe/:id",
        element:<ShowRecipe />
      },
      {
        path:"/createrecipe/:type",
        element:<CreateRecipe />
      },
      {
        path:"/showprofile",
        element:<ShowProfile />
      },
      {
        path:"/searchresults",
        element:<ShowSearchResults />
      },
      {
        path:"/editrecipe/:id",
        element:<EditRecipe />
      },
    ] 
  }
])

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}
export default App;

