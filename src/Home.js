// Imports
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from './firebase'; // Ensure 'storage' is imported correctly
import { ref, getDownloadURL } from 'firebase/storage';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Goldstone";
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
            <img src="path/to/error-icon.png" alt="Error" className="error-icon" />
            <p>Error: {error}</p>
            <p>Please restart the page.</p>
        </div>
    );

    return (
        <div className="home">
            <div className="slogan" data-aos="fade-up">
                <h1>Crafting Timeless Elegance from Earth’s Finest Marble</h1>
                <div className="wrapper" data-aos="fade-in"></div>
            </div>
            <div className="marbles" data-aos="fade-up" data-aos-delay="200">
                <div className="title">
                    <h1>Explore Our Exquisite Marble Collection</h1>
                </div>
                <div className="cards">
                    {data.slice(0, 2).map(item => (
                        <Link to={"quarries"} key={item.id}>
                            <div className="card" data-aos="zoom-in" data-aos-delay="200">
                                <div className="title">
                                    <h1>{item.name}</h1>
                                </div>
                                <img src={item.imageUrl} alt={item.name} />
                            </div>
                        </Link>
                    ))}
                    <div className='message' onClick={() => { navigate('contact'); }} data-aos="fade-right" data-aos-delay="200">
                        <div className="icon">
                            <img src="./Images/globe.png" alt="Globe Icon" />
                        </div>
                        <h1>Click to find our location or send us a message.</h1>
                        <div className="icon">
                            <img src="./Images/message.png" alt="Message Icon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
