import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from './firebase'; // Ensure 'storage' is imported correctly
import { ref, getDownloadURL } from 'firebase/storage';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

const Contact = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Contact | Goldstone";
        AOS.init({
            duration: 900, // animation duration in milliseconds
            once: true, // whether animation should happen only once - while scrolling down
        });

        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Contact_Icons'));
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
        <div className="contact">
            <div className="text" data-aos="fade-down">
                <h1>Contact Us.</h1>
                <p>Need to get in touch? We will always be here for you.</p>
                <div className="line" data-aos="fade-right"></div>
            </div>
            <div className="map">
                <div className="cards">
                    {data.map(item => (
                        <div className="card" data-aos="zoom-in" data-aos-delay="200" key={item.id}>
                            <img src={item.imageUrl} alt={item.name} />
                            <h1>{item.name}</h1>
                            <p>
                                {item.icon && <img src={item.icon} alt={`${item.name} icon`} />} 
                                {item.disc}
                            </p>
                            {item.disc2 && (
                                <p>
                                    {item.icon2 && <img src={item.icon2} alt={`${item.name} disc2 icon`} />} 
                                    {item.disc2}
                                </p>
                            )}
                        </div>
                    ))}
                    <div className="onlytext card" data-aos="zoom-in" data-aos-delay="300">
                        <h1>CONTACT US:</h1>
                        <p>Contact us for a quote or if you need help, or visit our social media.</p>
                        <div className="imgs">
                            <Link target='_blank' to="https://www.facebook.com/">
                                <img src="./Images/facebook.png" alt="Facebook" />
                            </Link>
                            <Link target='_blank' to="https://www.instagram.com/">
                                <img src="./Images/instagram.png" alt="Instagram" />
                            </Link>
                            <Link target='_blank' to="https://www.tiktok.com/">
                                <img src="./Images/tiktok.png" alt="Tiktok" />
                            </Link>
                        </div>
                    </div>
                    <div className="wrapper" data-aos="fade-in" data-aos-delay="400"></div>
                </div>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d215.79908124532753!2d30.944292856863402!3d30.071688125699662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sde!4v1725445078820!5m2!1sen!2sde"
                    width="600" 
                    height="450"  
                    allowFullScreen="" 
                    loading="lazy" 
                    title="Location"
                    referrerPolicy="no-referrer-when-downgrade"
                    data-aos="fade-up"
                    data-aos-delay="500">
                </iframe>
            </div>
        </div>
    );
}

export default Contact;
