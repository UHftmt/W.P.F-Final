import { useEffect, useState } from "react"
import './Home.css'
import ProductCard from "../components/ProductCard";

export default function Home() {
    const [page, setPage] = useState(2)
    const [data, setData] = useState({ products: [], moreProducts: true })
    const [loading, setLoading] = useState(false)
    const [checker, SetChecker] = useState(false)
    const url = `https://huitian.serv00.net/project/?type=list&batchNumber=${page}`;

    // init Load
    useEffect (() => {
        setLoading(true);
        async function initFetch() {
            const initPage = 'https://huitian.serv00.net/project/?type=list&batchNumber=1';
            try {
                const initFetch = await fetch(initPage);
                const initData = await initFetch.json();

                setData({
                    products: initData.products,
                    moreProducts: initData.moreProducts
                });
            } catch (error) {
                console.log("Uncessful init lodaing.")
            } finally {
                setLoading(false);
            }
        }
        initFetch();
    }, [])

    // load more
    useEffect (() => {
        async function Fetchdata(url) {
            setLoading(true);
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data)
                setData(prevData => ({
                    products: [...prevData.products, ...data.products],
                    moreProducts: data.moreProducts
                }));
                SetChecker(true)
                console.log(checker)
            } catch (error) {
                console.error("Data Fetch Error!");
            } finally {
                setLoading(false)
            }
        }
        Fetchdata(url);
    }, [page])

    if (!checker) {
        return (
            <div className="loading-message">
                Contenting is Loading...
            </div>
        )
    }

    return (
        <div className="ProductsDisplay">
            <div className="products" style={{
                display: 'grid',
                justifyContent: 'center',
                gridTemplateColumns: 'repeat(3, 400px)',
                gridTemplateRows: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
            }}>
            {data?.products?.map((product, index) => (
                    <ProductCard
                    key={index}
                    name={product.productId}
                    url={product.imageUrl}
                    price={product.price}
                    />
                ))}
            </div>
            <button className="load-button" onClick={() => setPage(page + 1)} disabled={loading||!data?.moreProducts}>{loading? "Loading...": "Load More Products"}</button>
        </div>
    )
}