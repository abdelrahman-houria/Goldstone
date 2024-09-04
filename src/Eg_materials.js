import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from './firebase'; // Ensure 'storage' is imported correctly
import { ref, getDownloadURL } from 'firebase/storage';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Eg = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Egyptian Materials | Goldstone";
        AOS.init({
            duration: 900, // animation duration in milliseconds
            once: true, // whether animation should happen only once - while scrolling down
        });

        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'EG_Materials'));
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
            <img src="path/to/error-icon.png" alt="Error" className="error-icon" />
            <p>Error: {error}</p>
            <p>Please restart the page.</p>
        </div>
    );
    
    return ( 
        <div className="eg">
            {data.map(item => (
                <div className="card" data-aos="fade-left" key={item.id}>
                    <img src={item.imageUrl} alt={item.name} /> {/* Use imageUrl here */}
                    <div className="text">
                        <h1>{item.name}</h1>
                        <p>{item.disc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Eg;
