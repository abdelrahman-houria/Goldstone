//Imports
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

//Pages
import Home from "./Home";
import About from "./About";
import Quarries from "./Quarries";
import Contact from "./Contact";
import Layout from "./Layout";
import Eg from "./Eg_materials";
import MaterialDetail from "./MaterialDetail";
import QuarryDetail from "./QuarryDetail";

//Router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element= {<Home />} />
      <Route path="/about" element= {<About />} />
      <Route path="/quarries" element= {<Quarries />} />
      <Route path="/contact" element= {<Contact />} />
      <Route path="/material/:id" element= {<MaterialDetail />} />
      <Route path="/quarry/:id" element= {<QuarryDetail />} />
      <Route path="/eg" element={<Eg />} />
    </Route>
  )
)

//Main_Function
function App() {
  return (
    <div className="app">
    <RouterProvider router={router} />        
    </div>
  );
}

export default App; 
