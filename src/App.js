import React, { useState } from 'react';
import { Leaf, Send } from 'lucide-react';

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

const EcoSwiper = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [swipeAnimation, setSwipeAnimation] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleSwipe = (isYes) => {
    setSwipeAnimation(isYes ? 'swipe-right' : 'swipe-left');
    setAnswers([...answers, { question: questions[currentIndex], answer: isYes }]);
    
    setTimeout(() => {
      setSwipeAnimation('');
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 300);
  };

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    const surveyData = {
      email,
      age,
      answers,
      timestamp: new Date().toISOString(),
      score: answers.filter(a => a.answer).length
    };

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      if (response.ok) {
        setSubmitted(true);
        setError('');
      } else {
        setError('Failed to submit survey. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    }
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Send className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-green-800 mb-4">Thank You!</h2>
          <p className="text-gray-600">Your responses have been recorded.</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= questions.length) {
    const yesCount = answers.filter(a => a.answer).length;
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <Leaf className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-green-800 mb-4">Survey Complete!</h2>
          <p className="text-lg text-gray-700 mb-6">
            Your Eco-Score: {yesCount} / 10
          </p>
          <p className="mb-6 text-gray-600">
            {yesCount >= 8 ? "You're an eco-warrior! 🌿" :
             yesCount >= 5 ? "You're on the right track! 🌱" :
             "There's room to grow greener! 🌺"}
          </p>

          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Your email"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Your age (optional)"
                className="w-full p-2 border rounded"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full transition-colors"
            >
              Submit Responses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${swipeAnimation}`}>
        <div className="absolute top-4 right-4">
          <span className="text-green-500 font-semibold">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        
        <div className="p-6 pt-12">
          <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6">
            <Leaf className="text-green-500" />
          </div>
          
          <h2 className="text-xl text-center font-semibold text-gray-800 mb-8">
            {questions[currentIndex]}
          </h2>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => handleSwipe(false)}
              className="bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 px-6 rounded-full transition-colors"
            >
              No
            </button>
            <button
              onClick={() => handleSwipe(true)}
              className="bg-green-100 hover:bg-green-200 text-green-600 font-bold py-3 px-6 rounded-full transition-colors"
            >
              Yes
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .swipe-left {
          animation: swipeLeft 0.3s ease-out;
        }
        
        .swipe-right {
          animation: swipeRight 0.3s ease-out;
        }
        
        @keyframes swipeLeft {
          to {
            transform: translateX(-100%) rotate(-5deg);
            opacity: 0;
          }
        }
        
        @keyframes swipeRight {
          to {
            transform: translateX(100%) rotate(5deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default EcoSwiper;
