import React, { useState } from 'react';

const questions = [
  "Do you regularly use reusable bags for shopping?",
  "Have you reduced meat consumption for environmental reasons?",
  "Do you actively try to reduce your water usage?",
  "Do you use public transportation when possible?",
  "Have you switched to energy-efficient light bulbs?",
  "Do you regularly recycle?",
  "Do you compost organic waste?",
  "Have you participated in environmental clean-up events?",
  "Do you avoid single-use plastics?",
  "Would you consider installing solar panels?"
];

const EcoSurvey = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [animation, setAnimation] = useState('');

  const handleAnswer = (answer) => {
    setAnimation(answer ? 'slide-right' : 'slide-left');
    
    // Add answer and move to next question after animation
    setTimeout(() => {
      setAnswers([...answers, answer]);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAnimation(''); // Reset animation
      }
    }, 300); // Match this with CSS animation duration
  };

  if (currentIndex >= questions.length) {
    const score = answers.filter(a => a).length;
    return (
      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#166534', marginBottom: '20px' }}>Survey Complete!</h2>
        <p style={{ textAlign: 'center', fontSize: '18px' }}>Your Eco-Score: {score} / 10</p>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          {score >= 8 ? "You're an eco-warrior! 🌿" :
           score >= 5 ? "You're on the right track! 🌱" :
           "There's room to grow greener! 🌺"}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <div 
        className={animation}
        style={{ 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'relative'
        }}
      >
        <div style={{ textAlign: 'right', marginBottom: '20px', color: '#166534' }}>
          {currentIndex + 1} / {questions.length}
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          {questions[currentIndex]}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button
            onClick={() => handleAnswer(false)}
            style={{
              padding: '10px 30px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            No
          </button>
          <button
            onClick={() => handleAnswer(true)}
            style={{
              padding: '10px 30px',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Yes
          </button>
        </div>
      </div>

      <style>
        {`
          .slide-left {
            animation: slideLeft 0.3s ease-out;
          }

          .slide-right {
            animation: slideRight 0.3s ease-out;
          }

          @keyframes slideLeft {
            to {
              transform: translateX(-100%) rotate(-5deg);
              opacity: 0;
            }
          }

          @keyframes slideRight {
            to {
              transform: translateX(100%) rotate(5deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default EcoSurvey;
