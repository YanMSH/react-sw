import './App.css'
import {Route, Routes} from "react-router-dom";
import AddForm from "./pages/AddForm";
import Home from "./pages/Home";

function App() {

  return (
    <div className="App">
        <Routes>
            <Route path={'/'} element={<Home />}/>
            <Route path={'/add'} element={<AddForm />}/>
        </Routes>

    </div>
  )
}

export default App
