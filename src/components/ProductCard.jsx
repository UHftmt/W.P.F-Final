import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({name, price, url}) {
    return (
        <div className="product-card">
            <Link to={`/product/${name}`}>
                <img src={url} alt="product picture" />
            </Link>
            <div className="product-info">
                <p>{name}</p>
                <p>{price}</p>
            </div>
        </div>
    )
}