import React from 'react';
import { Book, History, Sparkles } from 'lucide-react'; // Using icons

const Sidebar = ({ topics, history, onSelectTopic, selectedTopic }) => {
    return (
        <>
            <div className="sidebar-header">
                <Sparkles size={24} />
                <span>AI Learning</span>
            </div>

            <div className="topic-list">
                <div className="topic-section-title">
                    <History size={14} style={{ marginRight: 6, opacity: 0.7 }} />
                    Recent History (10)
                </div>
                {history.length === 0 && <div style={{ padding: '0 1rem', fontSize: '0.85rem', color: '#64748b' }}>No recent history</div>}
                {history.map((item, index) => (
                    <div
                        key={'hist-' + index}
                        className={`topic-item ${selectedTopic === item.topic ? 'active' : ''}`}
                        onClick={() => onSelectTopic(item.topic)}
                    >
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--secondary)' }}></div>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.topic}
                        </div>
                        <span style={{ fontSize: '0.7em', padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
                            {item.type}
                        </span>
                    </div>
                ))}

                <div className="topic-section-title">
                    <Book size={14} style={{ marginRight: 6, opacity: 0.7 }} />
                    Explore Topics
                </div>
                {topics.map((topic, index) => (
                    <div
                        key={index}
                        className={`topic-item ${selectedTopic === topic ? 'active' : ''}`}
                        onClick={() => onSelectTopic(topic)}
                    >
                        {topic}
                    </div>
                ))}
            </div>
        </>
    );
};
export default Sidebar;
