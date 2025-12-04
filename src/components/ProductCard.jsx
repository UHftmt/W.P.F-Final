import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({name, price, url, AddToCart}) {
    return (
        <div className="product-card">
            <Link to={`/product/${name}`}>
                <img src={url} alt="product picture" />
            </Link>
            <div className="product-info">
                <p><strong>{name}</strong></p>
                <p className='price'>{price}</p>
            </div>
            <button className='add-button' onClick={() => AddToCart}>Add to Cart</button>
        </div>
    )
}