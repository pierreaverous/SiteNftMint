
import App from "./App";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PageCollection2 from "./PageCollection2";
import PageCollection3 from "./PageCollection3";
import PageCollection4 from "./PageCollection4";
import PageCollection5 from "./PageCollection5";

const Router = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/collection2" element={<PageCollection2/>} />
                <Route path="/collection3" element={<PageCollection3/>} />
                <Route path="/collection4" element={<PageCollection4/>} />
                <Route path="/collection5" element={<PageCollection5/>} />
                {/*<Route path="/:id" element={<AccomadationPage/>}/>*/}

                {/*<Route path="*" element={<ErrorPage/>}/>*/}
            </Routes>

        </BrowserRouter>
    )

}

export default Router