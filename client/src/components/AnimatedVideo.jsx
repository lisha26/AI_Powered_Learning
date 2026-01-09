import React, { useState, useEffect } from 'react';
import { generateVideo } from '../services/api';
import { Play } from 'lucide-react';

const AnimatedVideo = ({ topic, onGenerate }) => {
    const [loading, setLoading] = useState(false);
    const [videoData, setVideoData] = useState(null);

    useEffect(() => {
        if (topic) {
            handleGenerate();
        }
    }, [topic]);

    const handleGenerate = async () => {
        setLoading(true);
        setVideoData(null);
        try {
            const res = await generateVideo(topic, 'manim');
            setVideoData(res);
            onGenerate();
        } catch (e) {
            console.error(e);
            alert("Failed to generate video");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Animated Video</h2>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                Generate a Python (Manim) animation script for: <strong>{topic}</strong>
            </p>

            {!videoData && (
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: 'fit-content' }}
                >
                    {loading ? "Generating Script..." : <><Play size={18} /> Generate Animation</>}
                </button>
            )}

            {videoData && (
                <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Generated Manim Script</h3>
                        <button className="btn-secondary" onClick={() => handleGenerate()}>Regenerate</button>
                    </div>

                    <pre className="code-block" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {videoData.script || JSON.stringify(videoData, null, 2)}
                    </pre>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(5, 150, 105, 0.1)', borderRadius: '6px', color: '#34d399', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                        <strong>Note:</strong> To view the actual video, this script needs to be executed on a server with Manim installed.
                        Currently, we are displaying the generated code.
                    </div>
                </div>
            )}
        </div>
    );
};
export default AnimatedVideo;
