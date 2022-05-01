import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import HowToUse from "./HowToUse";
function List(){
    return (<BrowserRouter>
          <Routes>
            <Route path="/" key="h1" element={<App/>}>
            </Route>
            <Route path="/howto" key="solve" element={<HowToUse/>}>
            </Route>
            <Route path="/solve" key="h2" element={<App/>}>
            </Route>
          </Routes>
        </BrowserRouter>);
}
export default List;