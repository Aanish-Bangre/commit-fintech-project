import React, { useState } from 'react';
import EducationOverview from '@/components/education/EducationOverview';
import TutorialViewer from '@/components/education/TutorialViewer';
import QuizComponent from '@/components/education/QuizComponent';

export default function EducationPage() {
  const [currentView, setCurrentView] = useState('overview');
  const [currentTutorial, setCurrentTutorial] = useState(null);

  const handleStartTutorial = (tutorialId) => {
    setCurrentTutorial(tutorialId);
    setCurrentView('tutorial');
  };

  const handleTutorialComplete = (tutorialId) => {
    setCurrentView('quiz');
  };

  const handleQuizComplete = (tutorialId, score) => {
    // Show success message and return to overview
    setCurrentView('overview');
    setCurrentTutorial(null);
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setCurrentTutorial(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'tutorial':
        return (
          <TutorialViewer 
            tutorialId={currentTutorial}
            onComplete={handleTutorialComplete}
            onBack={handleBackToOverview}
          />
        );
      case 'quiz':
        return (
          <QuizComponent 
            tutorialId={currentTutorial}
            onComplete={handleQuizComplete}
            onBack={handleBackToOverview}
          />
        );
      default:
        return (
          <EducationOverview 
            onStartTutorial={handleStartTutorial}
          />
        );
    }
  };

  return renderCurrentView();
}
