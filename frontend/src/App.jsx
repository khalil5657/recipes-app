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
  const [showBurger, setShowBurger] = useState(false)
  const [message, setMessage]= useState(false)
  const [messageContent, setMessageContent] = useState("")

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

  function showMessage(){
    setMessage(true)
      setTimeout(() => {
        setMessage(false)
      }, 3000);
  }

  function handleBurger(){
    if (showBurger==true){
      setShowBurger(false)
    }else{
      setShowBurger(true)
    }
  }

  if (loading){
    return <h1>Loading...</h1>
  }
  return <div>
          <nav>
            <div className="burger-container">
              <Link className='navhome'>Home</Link>
              <img src='burger-menu-svgrepo-com.svg' className='burger' onClick={()=>handleBurger()}/>
            </div>

            {showBurger==true&&
                  <div className='sidebar'>
                      <Link className='Link' style={{marginTop:"50px", display:"block"}}>Home</Link>
                      {user&&<div className='burger-navuser'>
                        <Link className='Link' to="/showprofile">
                          {user.img?<img src={user.img.url} className='profile-img'/>:<img src='https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg' className='profile-img'/>}
                          <div>{user.username}{user.id=="a123170a-59c4-412f-b803-ddb539deb658"&&<div className='admin'>Admin</div>}</div>
                        </Link>
                        <button onClick={logOut}>Logout</button>
                      </div>
                      }
                      <div className='burger-categories' >
                        categories
                        <div className="burger-catitems">
                          <Link className='Link' to="/showcategory/pizza">Pizza</Link>
                          <Link className='Link' to="/showcategory/burger">Burger</Link>
                          <Link className='Link' to="/showcategory/soup">Soup</Link>
                          <Link className='Link' to="/showcategory/sea food">Sea food</Link>
                          <Link className='Link' to="/showcategory/pasta&noodles">Pasta/Noodles</Link>
                        </div>
                      </div>
                      {!user&&<div className="burger-navlog"><Link className='l' to="/login">Login</Link><Link className='l' to="/signup">Signup</Link></div>}
                  </div>
                  }
      
            <div className='categories' >
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
              <input type="text" placeholder='search' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} required/>
              <Link className='Link' to="/searchresults" state={{value:searchValue.trim()}}>Search</Link>
            </div>
            {!user&&<div className="navlog"><Link className='l' to="/login">Login</Link><Link className='l' to="/signup">Signup</Link></div>}
            {user&&<div className='navuser'>
                      <Link className='Link' to="/showprofile">
                        {user.img?<img src={user.img.url} className='profile-img'/>:<img src='https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg' className='profile-img'/>}
                        <div>{user.username}{user.id=="a123170a-59c4-412f-b803-ddb539deb658"&&<div className='admin'>Admin</div>}
                        </div>
                      </Link>
                      <button onClick={logOut}>Logout</button>
                    </div>
            }
          </nav>
           {message==true&&<div className='message'>{messageContent}</div>}
          <Outlet context={[user, setUser, setMessageContent, showMessage ]}/>
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

