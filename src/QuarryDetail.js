import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from './firebase'; // Ensure 'storage' is imported correctly
import { ref, getDownloadURL } from 'firebase/storage';
import AOS from 'aos';
import 'aos/dist/aos.css';

const QuarryDetail = () => {
    const { id } = useParams(); // Get the 'id' from the URL
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Quarry Detail | Goldstone";
        AOS.init({
            duration: 900, // animation duration in milliseconds
            once: true, // whether animation should happen only once - while scrolling down
        });

        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Quarries'));
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Fetch the download URL for each image (main image) and additional images
                const itemsWithUrls = await Promise.all(items.map(async (item) => {
                    try {
                        const imageRef = ref(storage, item.url);
                        const imageUrl = await getDownloadURL(imageRef);

                        // Fetch download URLs for additional images
                        const imagesWithUrls = await Promise.all((item.Images || []).map(async (imagePath) => {
                            try {
                                const imgRef = ref(storage, imagePath);
                                return await getDownloadURL(imgRef);
                            } catch (err) {
                                console.error('Error fetching additional image URL:', err);
                                return '';
                            }
                        }));

                        // Fetch download URLs for videos
                        const videosWithUrls = await Promise.all((item.vids || []).map(async (videoPath) => {
                            try {
                                const videoRef = ref(storage, videoPath);
                                return await getDownloadURL(videoRef);
                            } catch (err) {
                                console.error('Error fetching video URL:', err);
                                return '';
                            }
                        }));

                        return { ...item, imageUrl, imagesWithUrls, videosWithUrls };
                    } catch (err) {
                        console.error('Error fetching main image URL:', err);
                        return { ...item, imageUrl: '', imagesWithUrls: [], videosWithUrls: [] };
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
    }, [id]);

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

    const filteredItem = data.filter(item => item.id === id);

    return (
        <div className="quarrydetail">
            {filteredItem.length > 0 ? (
                filteredItem.map(item => (
                    <div className='wrapper' key={item.id}>
                        <div className="card" data-aos="fade-up">
                            <img src={item.imageUrl} alt={item.name} />
                            <div className="text">
                                <h1 data-aos="fade-right">{item.name}</h1>
                                <p data-aos="fade-left">{item.disc}</p>
                            </div>
                        </div>
                        {item.imagesWithUrls && item.imagesWithUrls.length > 0 && (
                            <div className="line" data-aos="fade-in"></div>
                        )}
                        {item.imagesWithUrls && item.imagesWithUrls.length > 0 && item.videosWithUrls && item.videosWithUrls.length > 0 && (
                            <div className="images" data-aos="fade-up" data-aos-delay="200">
                                <h1>Gallery</h1>
                                <div className="gallery">
                                    {item.imagesWithUrls.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Quarry ${index + 1}`}
                                            className="additional-image"
                                            data-aos="fade-up"
                                            data-aos-delay="200" 
                                        />
                                    ))}
                                    {item.videosWithUrls.map((url, index) => (
                                        <video
                                            key={index}
                                            src={url}
                                            controls
                                            className="video"
                                            data-aos="fade-up"
                                            data-aos-delay="200" 
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>
                ))
            ) : (
                <div>No material found</div>
            )}
        </div>
    );
};

export default QuarryDetail;
