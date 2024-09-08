import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from './firebase'; // Ensure 'storage' is imported correctly
import { ref, getDownloadURL } from 'firebase/storage';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Quarries = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Quarries | Goldstone";
        AOS.init({
            duration: 900, // animation duration in milliseconds
            once: true, // whether animation should happen only once - while scrolling down
        });

        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Quarries'));
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
        <div className="quarries">
            {data.map(item => (
                <div className="section" data-aos="fade-up" data-aos-delay="200" key={item.id}>
                    <div className="cont">
                        <h1>{item.name}</h1>
                        <div className="card" data-aos="fade-right" data-aos-delay="300">
                            <p>{item.disc}</p>
                            <img src={item.imageUrl} alt={item.name} /> {/* Use imageUrl here */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Quarries;
