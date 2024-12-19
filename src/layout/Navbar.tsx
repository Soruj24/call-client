import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="flex gap-5 justify-center mt-2">
            <Link to="/">
                Home
            </Link>
            <Link to="/video">
                Video Call
            </Link>
            <Link to="/audio">
                Audio Call
            </Link>
            <Link to="/speck">
                Speck To Text
            </Link>
            <Link to="/texttospeck">
                Text To Speck
            </Link>
        </div>
    )
}

export default Navbar