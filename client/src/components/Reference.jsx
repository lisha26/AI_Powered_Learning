import React, { useEffect, useState } from 'react';
import { generateReference } from '../services/api';
import { FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import pptxgen from 'pptxgenjs';

const Reference = ({ topic, onGenerate }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!topic) return;
        setLoading(true);
        setError(null);
        setData(null);

        generateReference(topic)
            .then(res => {
                setData(res);
                onGenerate(); // Trigger history refresh
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [topic]);

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(topic, 10, 10);

        if (data) {
            doc.setFontSize(12);
            let y = 30;

            if (data.summary || data["4. A 500-word summary synthesizing these sources"]) {
                doc.text("Summary:", 10, y);
                y += 7;
                const summaryText = doc.splitTextToSize(data.summary || data["4. A 500-word summary synthesizing these sources"] || "", 180);
                doc.text(summaryText, 10, y);
                y += summaryText.length * 5 + 10;
            }

            const addSection = (title, items) => {
                doc.setFontSize(14);
                doc.text(title, 10, y);
                y += 7;
                doc.setFontSize(11);
                items.forEach(item => {
                    const text = typeof item === 'string' ? item : `${item.title} - ${item.author || item.journal || ''}`;
                    doc.text(`• ${text}`, 15, y);
                    y += 6;
                });
                y += 5;
            };

            const books = getList(["books", "1. Top 5 relevant books with authors and publication years"]);
            addSection("Books", books);

            const articles = getList(["articles", "2. Top 5 peer-reviewed articles with journal names"]);
            addSection("Articles", articles);
        }
        doc.save(`${topic}.pdf`);
    };

    const exportPPT = () => {
        const pres = new pptxgen();
        const slide = pres.addSlide();
        slide.addText(topic, { x: 1, y: 1, fontSize: 24, color: '363636' });

        if (data) {
            const summary = data.summary || data["4. A 500-word summary synthesizing these sources"];
            if (summary) {
                slide.addText("Summary", { x: 1, y: 2, fontSize: 18, bold: true });
                slide.addText(summary, { x: 1, y: 2.5, w: '80%', fontSize: 12 });
            }
        }
        pres.writeFile({ fileName: `${topic}.pptx` });
    };

    const getList = (keys) => {
        if (!data) return [];
        for (const key of keys) {
            if (data[key] && Array.isArray(data[key])) return data[key];
        }
        return [];
    };

    if (loading) return (
        <div className="section" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loader"></div>
            <p>Analyzing academic sources with AI...</p>
        </div>
    );
    if (error) return <div style={{ color: '#ef4444', padding: '2rem' }}>Error: {error}</div>;
    if (!data) return <div style={{ padding: '2rem' }}>Select a topic to start.</div>;

    const books = getList(["books", "1. Top 5 relevant books with authors and publication years"]);
    const articles = getList(["articles", "2. Top 5 peer-reviewed articles with journal names"]);
    const podcasts = getList(["podcasts", "3. Top 3 expert podcasts or lectures"]);
    const summary = data.summary || data["4. A 500-word summary synthesizing these sources"];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>References</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary" onClick={exportPDF}>
                        <FileText size={16} /> PDF
                    </button>
                    <button className="btn-secondary" onClick={exportPPT}>
                        <Download size={16} /> PPT
                    </button>
                </div>
            </div>

            {summary && (
                <section className="section">
                    <h3>Summary</h3>
                    <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{summary}</p>
                </section>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <section className="section">
                    <h3>📚 Books</h3>
                    <ul style={{ paddingLeft: '1.2rem' }}>
                        {books.map((item, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                {typeof item === 'string' ? item :
                                    <span><strong style={{ color: '#e2e8f0' }}>{item.title}</strong><br /><span style={{ fontSize: '0.9em' }}>{item.author} ({item.year})</span></span>
                                }
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="section">
                    <h3>📄 Articles</h3>
                    <ul style={{ paddingLeft: '1.2rem' }}>
                        {articles.map((item, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                {typeof item === 'string' ? item :
                                    <span><strong style={{ color: '#e2e8f0' }}>{item.title}</strong><br /><span style={{ fontSize: '0.9em' }}>{item.journal}</span></span>
                                }
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <section className="section" style={{ marginTop: '1rem' }}>
                <h3>🎙️ Podcasts & Lectures</h3>
                <ul style={{ paddingLeft: '1.2rem' }}>
                    {podcasts.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            {typeof item === 'string' ? item : item.title}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};
export default Reference;
