import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Avatar({ avatar }) {
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const navigate = useNavigate();
    const { state } = useLocation();

    function handleImage(e) {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setIsSaved(false);
        }
    }

    function getImage(e) {
        e.preventDefault();

        if (image) {
            const formData = new FormData();
            formData.append('avatar', image);
            avatar(state.id, formData);
            setIsSaved(true);
        }

        navigate('/');
    }

    if (!state) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container">
            <form onSubmit={getImage}>
                <div className="body">
                    <div>
                        <input className="input-control" type="file" onChange={handleImage} />
                    </div>
                    <div>
                        <img
                            src={preview || (state?.avatar
                                ? `http://localhost:3000/images/${state.avatar}`
                                : `http://localhost:3000/images/default.jpg`)}
                            alt="avatar"
                            onError={(e) => {
                                console.log('Image load error, falling back to default');
                                e.target.src = `http://localhost:3000/images/default.jpg`
                            }}
                        />
                    </div>
                </div>
                <div className="foot2">
                    <button className="btnAva" type="submit" disabled={isSaved}>
                        <i className="fa-solid fa-floppy-disk"></i>
                    </button>
                    <button className="btnAva" onClick={() => navigate('/')}>
                        <i className="fa-solid fa-rotate-left"></i>
                    </button>
                </div>
            </form>
        </div>
    );
}
