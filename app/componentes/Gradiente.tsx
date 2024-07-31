import { useEffect, useRef, useState } from 'react';

const GradientHeader = () => {
    const canvasRef = useRef(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current as any;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

        // Define los colores del gradiente
        gradient.addColorStop(0, '#FF5F6D');
        gradient.addColorStop(1, '#FFC371');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        setLoaded(true);
    }, []);

    return (
        <div className={`header-container ${loaded ? 'loaded' : ''}`}>
            <canvas ref={canvasRef} width="1920" height="600" className="gradient-canvas" />
            <div className="header-content">
                <h1>Infraestructura financiera para aumentar tus ingresos</h1>
                <p>Únete a las millones de empresas que usan nuestra plataforma...</p>
            </div>
        </div>
    );
};

export default GradientHeader;
