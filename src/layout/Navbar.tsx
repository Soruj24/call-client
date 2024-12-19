import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="flex gap-2 justify-center mt-2">
            <Link to="/">
                <Button>Home</Button>
            </Link>
            <Link to="/video">
                <Button>Video Call</Button>
            </Link>
            <Link to="/audio">
                <Button>Audio Call</Button>
            </Link>
            <Link to="/speck">
                <Button>Speck To Text</Button>
            </Link>
            <Link to="/texttospeck">
                <Button>Text To Speck</Button>
            </Link>
        </div>
    )
}

export default Navbar