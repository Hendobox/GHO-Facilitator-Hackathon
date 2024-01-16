import { ConnectKitButton } from "connectkit"
import { Link } from "react-router-dom"

export default function NavBar() {
    return (
        <nav className="flex flex-row px-28 py-8 justify-between text-white">
            <ul className="flex flex-row items-center gap-4">
                <li>
                    <Link to={"/"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="36" viewBox="0 0 35 36" fill="none">
                            <circle cx="17.5" cy="18" r="17.5" fill="#6D28D9" />
                        </svg>
                    </Link>
                </li>
                <li>
                    <Link to={"/borrow"}>Borrow</Link>
                </li>
            </ul>
            <ConnectKitButton />
        </nav>
    )
}