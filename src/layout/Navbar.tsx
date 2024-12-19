import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="flex gap-2 justify-center mt-2">
            <Link to="/">
                <Button variant='outline'>Home</Button>
            </Link>
            <Link to="/video">
                <Button variant='outline'>Video Call</Button>
            </Link>
            <Link to="/audio">
                <Button variant='outline'>Audio Call</Button>
            </Link>
            <Link to="/speck">
                <Button variant='outline'>Speck To Text</Button>
            </Link>
            <Link to="/texttospeck">
                <Button variant='outline'>Text To Speck</Button>
            </Link>
        </div>
    )
}

export default Navbar