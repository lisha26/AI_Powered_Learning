import React, { useState } from 'react';
import { generateAudio, generateReference } from '../services/api';
import { Mic, RefreshCw } from 'lucide-react';

const AudioExplanation = ({ topic, onGenerate }) => {
    const [audioUrl, setAudioUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (topic) {
            handleGenerate();
        }
    }, [topic]);

    const handleGenerate = async () => {
        setLoading(true);
        setStatus("Fetching reference content...");
        try {
            const refData = await generateReference(topic);
            const summary = refData.summary || refData["4. A 500-word summary synthesizing these sources"] || "No summary available.";

            setStatus("Generating audio with ElevenLabs...");
            const blob = await generateAudio(summary, 'en', topic);
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            onGenerate(); // Refresh history
            setStatus("Done!");
        } catch (e) {
            console.error(e);
            setStatus("Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Audio Explanation</h2>

            {!audioUrl && (
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: 'fit-content' }}
                >
                    {loading ? status : <><Mic size={18} /> Generate Audio Explanation</>}
                </button>
            )}

            {audioUrl && (
                <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>🎧 Listen to Explanation</h3>
                    <audio controls style={{ width: '100%', maxWidth: '500px' }} src={audioUrl} autoPlay>
                        Your browser does not support the audio element.
                    </audio>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <button
                            className="btn-secondary"
                            onClick={() => setAudioUrl(null)}
                        >
                            <RefreshCw size={14} /> Generate New
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AudioExplanation;
