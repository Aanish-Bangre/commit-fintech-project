import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, Brain, Award, RotateCcw, Target } from 'lucide-react';

const QuizComponent = ({ tutorialId, onComplete, onBack }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { tutorials } = await import('@/utils/educationData');
      const tutorial = tutorials.find(t => t.id === tutorialId);
      setQuiz(tutorial?.quiz);
      setIsLoading(false);
    };
    
    loadQuiz();
  }, [tutorialId]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    // Update progress
    const { updateUserProgress } = require('@/utils/educationData');
    updateUserProgress(tutorialId, null, finalScore);
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! You\'ve mastered this topic.';
    if (score >= 60) return 'Good job! Consider reviewing some concepts.';
    return 'Keep studying! Review the tutorial and try again.';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  text-white px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Loading Quiz</h2>
            <p className="text-gray-400">Preparing your assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen  text-white px-6 py-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-2xl font-semibold text-white mb-2">Quiz Not Available</h2>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Center
          </Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen  text-white px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h1>
            <p className="text-gray-400">Here are your results</p>
          </div>

          {/* Score Card */}
          <Card className="p-8 bg-gray-800 border-gray-700 mb-8 text-center">
            <div className="mb-6">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
                {score}%
              </div>
              <div className="text-xl text-gray-300 mb-4">
                {quiz.questions.filter((q, i) => selectedAnswers[q.id] === q.correct).length} out of {quiz.questions.length} correct
              </div>
              <p className={`text-lg ${getScoreColor(score)}`}>
                {getScoreMessage(score)}
              </p>
            </div>

            {score >= 80 && (
              <div className="p-4 bg-green-900/30 border border-green-500/30 rounded-lg mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-6 h-6 text-yellow-400 mr-2" />
                  <span className="text-yellow-400 font-semibold">Certificate Earned!</span>
                </div>
                <p className="text-green-300">
                  You've successfully completed this tutorial and earned a certificate.
                </p>
              </div>
            )}
          </Card>

          {/* Question Review */}
          <Card className="p-6 bg-gray-800 border-gray-700 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">Question Review</h3>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const isCorrect = selectedAnswers[question.id] === question.correct;
                const selectedAnswer = selectedAnswers[question.id];
                
                return (
                  <div key={question.id} className="border-b border-gray-700 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start mb-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 mr-3 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-white mb-3">
                          {index + 1}. {question.question}
                        </h4>
                        
                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                optionIndex === question.correct
                                  ? 'border-green-500 bg-green-900/20 text-green-300'
                                  : optionIndex === selectedAnswer && !isCorrect
                                  ? 'border-red-500 bg-red-900/20 text-red-300'
                                  : 'border-gray-600 bg-gray-700 text-gray-300'
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 text-xs font-semibold">
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                {option}
                                {optionIndex === question.correct && (
                                  <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                                )}
                                {optionIndex === selectedAnswer && !isCorrect && (
                                  <XCircle className="w-4 h-4 text-red-400 ml-auto" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                          <div className="flex items-start">
                            <Target className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-blue-300 font-medium">Explanation: </span>
                              <span className="text-gray-300">{question.explanation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button onClick={onBack} variant="outline" className="border-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Center
            </Button>
            {score < 80 && (
              <Button onClick={handleRetakeQuiz} className="bg-blue-600 hover:bg-blue-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
            )}
            <Button 
              onClick={() => onComplete(tutorialId, score)}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = Math.round(((currentQuestion + 1) / quiz.questions.length) * 100);
  const allQuestionsAnswered = quiz.questions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="min-h-screen  text-white px-6 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" className="border-gray-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
            <p className="text-gray-400">Test your knowledge</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Question {currentQuestion + 1} of {quiz.questions.length}</div>
            <div className="text-lg font-semibold text-purple-400">{progress}% Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-purple-500 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 bg-gray-800 border-gray-700 mb-8">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Question {currentQuestion + 1}</h2>
                <p className="text-gray-400">{question.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              </div>
            </div>
            <h3 className="text-2xl font-medium text-white mb-6">{question.question}</h3>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(question.id, index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswers[question.id] === index
                    ? 'border-purple-500 bg-purple-900/30 text-white'
                    : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
            className="border-gray-700"
          >
            Previous Question
          </Button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <Button 
              onClick={handleSubmitQuiz}
              disabled={!allQuestionsAnswered}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              disabled={selectedAnswers[question.id] === undefined}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Next Question
            </Button>
          )}
        </div>

        {/* Question Progress Indicators */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {quiz.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                  index === currentQuestion
                    ? 'bg-purple-500 text-white'
                    : selectedAnswers[q.id] !== undefined
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
