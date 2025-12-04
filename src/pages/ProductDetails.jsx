import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "./ProductDetails.css"

export default function ProductDetail({AddToCart}) {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const [activatedIndex, setActivatedIndex] = useState(0);

    useEffect(() => {
        async function FetchDetail(ProductId) {
            try {
                const response = await fetch(`https://huitian.serv00.net/project/?productId=${ProductId}`);
                const data = await response.json();
                setDetail(data);
                console.log(data)
                console.log(detail)
            } catch (error) {
                console.log("Fetch product detail fail.")
            }
        }
        FetchDetail( `${ id }` )
    }, [id]);

    if (!detail) {
        return (
            <div>Loading...</div>
        )
    };

    return (
        <div className="Productdisplay">
            <div className="ProductPics">
                <div className="Left-bar">
                   {detail?.imageUrls?.map((url, index) => (
                        <img key={index} src={url} alt="Product Image" className="ProductDetailImage" onClick={() => setActivatedIndex(index)} />
                   ))}
                </div>
                <div className="Right-screen">
                   <img src={detail?.imageUrls[activatedIndex]} alt="bigger version of selected pic" className="BigBeautifulPic" />
                </div>
            </div>
            <div className="ProductDetails">
                <h1 className="info">Product ID: { id }</h1>
                <p className="info"><strong>Price:</strong>{detail.price}</p>
                <button className="add-button" onClick={() => AddToCart}>Add to Chart</button>
                <p className="info"><strong>Description:</strong> {detail.shortDescription}</p>
                <p className="info"><strong>Screen Size:</strong> {detail.screenSize}</p>
                <p className="info"><strong>Weight:</strong> {detail.weight}</p>
                <p className="info"><strong>Batter Spec:</strong> {detail.batterySpec}</p>
            </div>
        </div>
    )
};