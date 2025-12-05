import { useEffect, useState } from "react";
import "./Home.css";
import ProductCard from "../components/ProductCard";
import { useCart } from "./Cart";

export default function Home() {
  const [page, setPage] = useState(3);
  const [data, setData] = useState({ products: [], moreProducts: true });
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();   // <-- get addToCart here
  const url = `https://huitian.serv00.net/project/?type=list&batchNumber=${page}`;

    // init Load
    useEffect (() => {
        setLoading(true);
        async function initFetch() {
            try {
                const promise1 = fetch('https://huitian.serv00.net/project/?type=list&batchNumber=1');
                const promise2 = fetch('https://huitian.serv00.net/project/?type=list&batchNumber=2');
                const [initFetch1, initFetch2] = await Promise.all([promise1, promise2]);
                const initData1 = await initFetch1.json();
                const initData2 = await initFetch2.json();

                setData({
                    products: [...initData1.products, ...initData2.products],
                    moreProducts: initData2.moreProducts
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
        setLoading(true);
        async function Fetchdata(url) {
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data)
                setData(prevData => ({
                    products: [...prevData.products, ...data.products],
                    moreProducts: data.moreProducts
                }));
            } catch (error) {
                console.error("Data Fetch Error!");
            } finally {
                setLoading(false)
            }
        }
        Fetchdata(url);
    }, [page])

    if (loading && !data.products.length) {
      return (
        <div className="loading-message">
          Contenting is Loading...
        </div>
      );
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
                    onAddToCart={() =>
                        addToCart({
                            productId: product.productId,
                            name: product.productId,        // or product.name if available
                            price: product.price,
                            image: product.imageUrl,
                        })
                    }
                />
            ))}
            </div>
            <button className="load-button" onClick={() => setPage(page + 1)} disabled={loading||!data?.moreProducts}>{loading? "Loading...": "Load More Products"}</button>
        </div>
    )
}