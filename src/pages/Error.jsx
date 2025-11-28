import { Link } from "react-router-dom";

export default function Error() {
    return (
        <div>
            <p>This page is not found.</p>
            <p>Return to <Link to='/'>Homepage</Link>?</p>
        </div>
    )
}