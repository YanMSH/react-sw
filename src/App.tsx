import { useState } from 'react'
import './App.css'
import Table from "./components/Table";
import {Route, Routes} from "react-router-dom";
import AddForm from "./pages/AddForm";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
        <Routes>
            <Route path={'/'} element={<Table />}/>
            <Route path={'/add'} element={<AddForm />}/>
        </Routes>

    </div>
  )
}

export default App
