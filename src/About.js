import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from './firebase'; // Ensure 'storage' is imported correctly
import { ref, getDownloadURL } from 'firebase/storage';

import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "About | Goldstone";
        AOS.init({
            duration: 900,
            once: true,
        });

        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'About_Icons'));
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Fetch the download URL for each image
                const itemsWithUrls = await Promise.all(items.map(async (item) => {
                    try {
                        const imageRef = ref(storage, item.url); // Reference to the image
                        const imageUrl = await getDownloadURL(imageRef); // Get download URL
                        return { ...item, imageUrl };
                    } catch (err) {
                        console.error('Error fetching image URL:', err);
                        return { ...item, imageUrl: '' }; // Default or empty URL in case of error
                    }
                }));

                setData(itemsWithUrls);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, []);

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <img src="/Icons/error.png" alt="Error" className="error-icon" />
            <p>Error: {error}</p>
            <p>Please restart the page.</p>
        </div>
    );

    return ( 
        <div className="about">
            <div className="cont">
                <div className="text" data-aos="fade-up">
                    <h1>Welcome to Goldstone - Crafting Excellence in Marble</h1>
                    <div className="line" data-aos="fade-right"></div>
                    <p>With a rich heritage spanning over two decades, Goldstone stands as a cornerstone in the marble industry. Founded as a family business, our journey began with a passion for quality and a commitment to craftsmanship.</p>
                    <p>Today, as we reintroduce ourselves to the market, we bring forth a renewed dedication to delivering the finest marbles sourced from our own quarries. Our expertise is not just in mining and extraction but also in transforming raw marble into exquisite works of art that adorn homes and spaces with timeless elegance.</p>
                    <p>At Goldstone, we blend traditional craftsmanship with modern techniques to offer a range of marble products that cater to diverse aesthetic preferences and functional needs. Whether you seek classic sophistication or contemporary allure, our collection promises to elevate any environment.</p>
                    <p>Beyond our products, our reputation is built on integrity, reliability, and a deep-rooted passion for what we do. We take pride in our hands-on approach, ensuring every slab and tile meets the highest standards before reaching our clients.</p>
                    <div className="wrapper" data-aos="fade-left"></div>
                </div>
                <div className="cards">
                    {data.map(item => (
                        <div className="card" data-aos="fade-up" data-aos-delay="100" key={item.id}>
                            <img src={item.imageUrl} alt={item.name} />
                            <h1>{item.name}</h1>
                            <p>{item.disc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default About;
