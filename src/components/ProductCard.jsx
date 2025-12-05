import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({name, price, url, onAddToCart}) {
    
    return (
        <div className="product-card">
            <Link to={`/product/${name}`}>
                <img src={url} alt="product picture" />
            </Link>
            <div className="product-info">
                <p><strong>{name}</strong></p>
                <p className='price'>{price}</p>
            </div>
            <button className='add-button' onClick={onAddToCart}>Add to Cart</button>
        </div>
    )
}