import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {

  const navigate = useNavigate()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")

  async function login(){

    try{

      const res = await fetch("http://localhost:5000/auth/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email,
          password
        })
      })

      const data = await res.json()

      if(data.success){

        localStorage.setItem("horizon_user",data.user_id)

        navigate("/")
      }
      else{
        setError("Invalid login")
      }

    }catch{
      setError("Server error")
    }

  }

  return(

    <div style={{
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"center",
      height:"100vh",
      background:"#071526",
      color:"white"
    }}>

      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        style={{margin:10,padding:10,width:250}}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e=>setPassword(e.target.value)}
        style={{margin:10,padding:10,width:250}}
      />

      <button onClick={login} style={{padding:10,width:200}}>
        Login
      </button>

      {error && <p style={{color:"red"}}>{error}</p>}

    </div>

  )

}

export default Login