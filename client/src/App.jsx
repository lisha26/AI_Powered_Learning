import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Reference from './components/Reference';
import AnimatedVideo from './components/AnimatedVideo';
import AudioExplanation from './components/AudioExplanation';
import MindMapGenerator from './components/MindMapGenerator';
import { getTopics, getHistory } from './services/api';
import './App.css';
import { BookOpen, Video, Mic, Share2, Menu, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [topics, setTopics] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("Data Structures - Stack Operations");
  const [activeTab, setActiveTab] = useState('reference');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    getTopics().then(setTopics).catch(console.error);
    refreshHistory();
  }, []);

  const refreshHistory = () => {
    getHistory().then(setHistory).catch(console.error);
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setSelectedTopic(userInput);
    setUserInput("");
    // Rely on the sub-components detecting the 'selectedTopic' change 
    // or we can force them to regenerate if the topic is same but user wants new output.
    // For now, updating selectedTopic triggers the effect in sub-components.
  };

  const renderContent = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="container-card"
        key={activeTab + selectedTopic}
      >
        <div id="export-content">
          {activeTab === 'reference' && <Reference topic={selectedTopic} onGenerate={refreshHistory} />}
          {activeTab === 'video' && <AnimatedVideo topic={selectedTopic} onGenerate={refreshHistory} />}
          {activeTab === 'audio' && <AudioExplanation topic={selectedTopic} onGenerate={refreshHistory} />}
          {activeTab === 'mindmap' && <MindMapGenerator topic={selectedTopic} onGenerate={refreshHistory} />}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="app-container">
      <div className={`mobile-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)} />

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar
          topics={topics}
          history={history}
          selectedTopic={selectedTopic}
          onSelectTopic={handleSelectTopic}
        />
      </div>

      <main className="main-content">
        <header className="header">
          <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Topic</span>
            <h1>{selectedTopic}</h1>
          </div>
          <div style={{ width: 24 }} />
        </header>

        <div className="tabs">
          <TabButton
            active={activeTab === 'reference'}
            onClick={() => setActiveTab('reference')}
            icon={<BookOpen size={18} />}
            label="Reference"
          />
          <TabButton
            active={activeTab === 'video'}
            onClick={() => setActiveTab('video')}
            icon={<Video size={18} />}
            label="Video"
          />
          <TabButton
            active={activeTab === 'audio'}
            onClick={() => setActiveTab('audio')}
            icon={<Mic size={18} />}
            label="Audio"
          />
          <TabButton
            active={activeTab === 'mindmap'}
            onClick={() => setActiveTab('mindmap')}
            icon={<Share2 size={18} />}
            label="Mind Map"
          />
        </div>

        <div className="content-area">
          <AnimatePresence mode='wait'>
            {renderContent()}
          </AnimatePresence>
        </div>

        <div className="chat-input-container">
          <form className="chat-input-wrapper" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder={`Ask AI to generate ${activeTab} content...`}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button type="submit" className="chat-submit-btn">
              <Send size={18} />
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`tab-button ${active ? 'active' : ''}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
