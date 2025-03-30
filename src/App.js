import React, { useState, useEffect } from 'react';
import { Heart, Scale, Building, Bike, TreePine, Bell, AlertTriangle, FileCheck, HelpCircle, X, Check, Loader2 } from 'lucide-react';

const EcoSurvey = () => {
  // Supabase configuration details
  const SUPABASE_URL = 'https://pwzysvhvelujwbbegncp.supabase.co';
  const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3enlzdmh2ZWx1andiYmVnbmNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMjE5MTIsImV4cCI6MjA1NDU5NzkxMn0.WVaEPPK4oRDnzGcmjYbFNZYKNW7TOgA6W-R0kpirCcc';
  const SUPABASE_TABLE = 'eco_survey_responses';

  const questions = [
    {
      text: "Did you know about the Environmental Protection Act - the law that bans Diwali firecrackers?",
      icon: <Scale className="w-12 h-12 text-pink-500" />,
      options: ["Yes", "No"],
      type: "heart-cross"
    },
    {
      text: "Have you heard of India's air, water, and wildlife protection laws?",
      icon: <FileCheck className="w-12 h-12 text-pink-500" />,
      options: ["Yes", "No"],
      type: "heart-cross"
    },
    {
      text: "Where did you learn about these laws?",
      icon: <HelpCircle className="w-12 h-12 text-pink-500" />,
      options: ["School/College", "News", "Social Media", "Government Campaigns", "Others", "None"],
      type: "single"
    },
    {
      text: "With Delhi's AQI often in 'severe' zone, do you think these laws actually work?",
      icon: <AlertTriangle className="w-12 h-12 text-pink-500" />,
      options: ["Yes", "No"],
      type: "single"
    },
    {
      text: "Seen any environmental violations like garbage dumping or tree cutting?",
      icon: <Bell className="w-12 h-12 text-pink-500" />,
      options: ["Yes", "No"],
      type: "single"
    },
    {
      text: "Did you report it? Quick fact: You can use the Green Delhi app!",
      icon: <Bell className="w-12 h-12 text-pink-500" />,
      options: ["Yes", "No", "Didn't know how"],
      type: "single"
    },
    {
      text: "How well do authorities handle environmental issues?",
      icon: <Building className="w-12 h-12 text-pink-500" />,
      options: ["Very effective", "Somewhat effective", "Not effective"],
      type: "single"
    },
    {
      text: "Do you think businesses follow environmental rules?",
      icon: <Building className="w-12 h-12 text-pink-500" />,
      options: ["Yes", "No"],
      type: "single"
    },
    {
      text: "Is the government doing enough to protect our environment?",
      icon: <Scale className="w-12 h-12 text-pink-500" />,
      options: ["Yes", "No"],
      type: "single"
    },
    {
      text: "Would you join a legal fight (PIL) to protect the environment?",
      icon: <Scale className="w-12 h-12 text-pink-500" />,
      options: ["Yes", "No"],
      type: "single"
    },
    {
      text: "Do public protests and campaigns help protect nature?",
      icon: <Bell className="w-12 h-12 text-pink-500" />,
      options: ["Yes", "No"],
      type: "single"
    },
    {
      text: "Do you take eco-friendly actions like using cloth bags or the metro?",
      icon: <Bike className="w-12 h-12 text-pink-500" />,
      options: ["Yes", "No"],
      type: "single"
    },
    {
      text: "What's stopping Delhi from being clean and green?",
      icon: <TreePine className="w-12 h-12 text-pink-500" />,
      options: [
        "Lack of public awareness",
        "Poor law enforcement",
        "Corruption",
        "Too much construction",
        "Industrial pollution",
        "Too many vehicles",
        "Not enough government funds",
        "Political issues",
        "Lack of public participation",
        "Population pressure",
        "Poverty",
        "Weak penalties for violations"
      ],
      type: "multiple",
      maxSelections: 3
    },
    {
      text: "Are penalties strict enough for polluters?",
      icon: <Scale className="w-12 h-12 text-pink-500" />,
      options: ["Yes", "No"],
      type: "single"
    }
  ];

  const transitionMessages = [
    { message: (name) => `${name}, you're already making the Earth blush! 💝`, subtext: "Your first answer shows you care!" },
    { message: (name) => `Eco-chemistry alert! ✨`, subtext: "You and Mother Earth are meant to be!" },
    { message: (name) => `Nature is head over heels! 🌿`, subtext: "Keep that green love flowing!" },
    { message: (name) => `Delhi's newest eco-heartthrob! 🌱`, subtext: "Making our city fall for your green choices!" },
    { message: (name) => `You're Nature's perfect match! 🌍`, subtext: "This could be the start of something special!" },
    { message: (name) => `Mother Earth just super-liked you! 💫`, subtext: "She loves your environmental awareness!" }
  ];

  const [userName, setUserName] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showTransition, setShowTransition] = useState(false);
  const [currentTransition, setCurrentTransition] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [selectedHeartCross, setSelectedHeartCross] = useState(null);

  const shouldShowTransition = (questionIndex) => {
    return [0, 3, 5, 7, 9, 11].includes(questionIndex);
  };

  // Function to submit data to Supabase
  const submitToSupabase = async () => {
    if (isSubmitting || submitStatus === 'success') return;
    
    setIsSubmitting(true);
    
    try {
      // Format the data
      const surveyData = {
        user_name: userName,
        created_at: new Date().toISOString(),
        responses: {}
      };
      
      // Map questions to answers
      questions.forEach((question, index) => {
        const questionKey = `q${index + 1}`;
        surveyData.responses[questionKey] = {
          question: question.text,
          answer: answers[index]
        };
      });
      
      // Insert the data into Supabase using fetch API
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(surveyData)
      });
        
      if (!response.ok) {
        console.error('Error submitting to Supabase:', response.statusText);
        setSubmitStatus('error');
      } else {
        console.log('Successfully submitted to Supabase');
        setSubmitStatus('success');
      }
    } catch (err) {
      console.error('Exception when submitting to Supabase:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use effect to submit data when survey is complete
  useEffect(() => {
    if (currentIndex >= questions.length) {
      submitToSupabase();
    }
  }, [currentIndex]);

  // Handle answer selection
  const handleAnswer = (answer) => {
    if (questions[currentIndex].type === "multiple") {
      if (selectedOptions.includes(answer)) {
        setSelectedOptions(selectedOptions.filter(opt => opt !== answer));
      } else if (selectedOptions.length < questions[currentIndex].maxSelections) {
        setSelectedOptions([...selectedOptions, answer]);
      }
    } else {
      const shouldTransition = shouldShowTransition(currentIndex);
      if (shouldTransition && currentIndex < questions.length - 1) {
        setShowTransition(true);
        setCurrentTransition(Math.floor(Math.random() * transitionMessages.length));
        setTimeout(() => {
          setShowTransition(false);
          setAnswers([...answers, answer]);
          setCurrentIndex(currentIndex + 1);
        }, 1500);
      } else {
        setAnswers([...answers, answer]);
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  // Handle submission of multiple choice answers
  const handleMultipleSubmit = () => {
    if (selectedOptions.length > 0) {
      const shouldTransition = shouldShowTransition(currentIndex);
      if (shouldTransition && currentIndex < questions.length - 1) {
        setShowTransition(true);
        setCurrentTransition(Math.floor(Math.random() * transitionMessages.length));
        setTimeout(() => {
          setShowTransition(false);
          setAnswers([...answers, selectedOptions]);
          setSelectedOptions([]);
          setCurrentIndex(currentIndex + 1);
        }, 1500);
      } else {
        setAnswers([...answers, selectedOptions]);
        setSelectedOptions([]);
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  // Render options based on question type
  const renderOptions = (question) => {
    if (question.type === "heart-cross") {
      return (
        <div className="flex justify-center gap-8">
          <button
            onClick={() => {
              setSelectedHeartCross("No");
              setTimeout(() => {
                handleAnswer("No");
                setSelectedHeartCross(null);
              }, 500);
            }}
            className={`p-6 rounded-full transition-colors border-4 ${
              selectedHeartCross === "No" 
                ? "border-red-500 bg-red-50" 
                : "border-red-300 hover:border-red-500 hover:bg-red-50"
            }`}
          >
            <X 
              className="w-16 h-16 text-red-500" 
            />
          </button>
          <button
            onClick={() => {
              setSelectedHeartCross("Yes");
              setTimeout(() => {
                handleAnswer("Yes");
                setSelectedHeartCross(null);
              }, 500);
            }}
            className={`p-6 rounded-full transition-colors border-4 ${
              selectedHeartCross === "Yes" 
                ? "border-green-500 bg-green-50" 
                : "border-green-300 hover:border-green-500 hover:bg-green-50"
            }`}
          >
            <Heart 
              className="w-16 h-16 text-green-500" 
              fill={selectedHeartCross === "Yes" ? "currentColor" : "none"} 
            />
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className={`p-3 rounded-lg transition-colors ${
              question.type === "multiple"
                ? selectedOptions.includes(option)
                  ? "bg-pink-500 text-white"
                  : "bg-white border-2 border-pink-200 hover:bg-pink-50"
                : "bg-white border-2 border-pink-200 hover:bg-pink-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  // Welcome screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 via-pink-50 to-red-50 p-4">
        <div className="max-w-md mx-auto my-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="text-center">
              <Heart className="w-16 h-16 mx-auto text-pink-500" fill="currentColor" />
              <h2 className="text-2xl font-bold mb-4 text-pink-700">Welcome to the Environmental Survey! 💚</h2>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 border-2 border-pink-200 rounded-lg mb-4 focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={() => setHasStarted(true)}
                disabled={!userName.trim()}
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg disabled:opacity-50"
              >
                Start Survey
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Thank you screen
  if (currentIndex >= questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 via-pink-50 to-red-50 p-4">
        <div className="max-w-md mx-auto my-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="text-center">
              <Heart className="w-16 h-16 mx-auto text-pink-500" fill="currentColor" />
              <h2 className="text-2xl font-bold mb-4 text-pink-700">Thank you, {userName}! 💖</h2>
              <p className="text-lg mb-4 text-pink-600">
                Your love for the environment makes our planet smile!
              </p>
              <p className="text-sm text-pink-600 mb-4">
                Together, we can make Delhi fall in love with nature again.
              </p>
              
              {/* Show submission status */}
              {isSubmitting && (
                <div className="flex items-center justify-center text-pink-600 mt-4">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving your responses...
                </div>
              )}
              
              {submitStatus === 'success' && (
                <div className="flex items-center justify-center text-green-600 mt-4">
                  <Check className="w-5 h-5 mr-2" />
                  Your responses have been saved successfully!
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="flex items-center justify-center text-red-600 mt-4">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  There was an error saving your responses. Please try again later.
                  <button 
                    onClick={submitToSupabase} 
                    className="ml-2 text-pink-600 underline"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Survey question screen
  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-pink-50 to-red-50 p-4">
      <div className="max-w-md mx-auto my-8">
        <div className="text-center mb-4">
          <p className="text-sm text-pink-500">Question {currentIndex + 1} of {questions.length}</p>
        </div>

        {showTransition ? (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="text-center">
                <Heart className="w-16 h-16 mx-auto text-pink-500 mb-4" fill="currentColor" />
                <h2 className="text-2xl font-bold mb-2 text-pink-700">
                  {transitionMessages[currentTransition].message(userName)}
                </h2>
                <p className="text-pink-600">
                  {transitionMessages[currentTransition].subtext}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                {currentQuestion.icon}
              </div>
              <h2 className="text-xl font-bold text-center mb-6 text-pink-700">
                {currentQuestion.text}
              </h2>
              
              {renderOptions(currentQuestion)}

              {currentQuestion.type === "multiple" && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-pink-600 mb-2">
                    Selected: {selectedOptions.length} / {currentQuestion.maxSelections}
                  </p>
                  <button
                    onClick={handleMultipleSubmit}
                    disabled={selectedOptions.length === 0}
                    className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoSurvey;
 
           

        
  
