import App from "@/App";
import Audio from "@/page/Audio";
import Home from "@/page/Home";
import Speck from "@/page/Speck";
import TextToSpeck from "@/page/TextToSpeck";
import Video from "@/page/Video";
import {
    createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,

        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/video",
                element: <Video />
            },
            {
                path: "/audio",
                element: <Audio />
            },
            {
                path: "/speck",
                element: <Speck />
            },
            {
                path:'/texttospeck',
                element:<TextToSpeck/>
            }
        ]
    },
]);

export default router