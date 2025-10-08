import React, { useState, useCallback, useEffect } from 'react';
import { View, AnalysisResult, CareTip, AnalysisHistoryItem, SoilAnalysisResult } from './types';
import { analyzePlantHealth, fetchGeneralCareTips, translateAnalysisResult, translateCareTips, analyzeSoil, translateSoilAnalysisResult } from './services/geminiService';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import AnalysisScreen from './components/AnalysisScreen';
import { QuestionMarkCircleIcon, ArrowLeftIcon } from './components/icons';
import CareTipsScreen from './components/CareTipsScreen';
import ScanScreen from './components/ScanScreen';
import CameraScreen from './components/CameraScreen';
import HistoryScreen from './components/HistoryScreen';
import SoilScanScreen from './components/SoilScanScreen';
import SoilAnalysisScreen from './components/SoilAnalysisScreen';


export const SUPPORTED_LANGUAGES = [
    'Arabic', 'Bengali', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Dutch',
    'English', 'French', 'German', 'Hindi', 'Indonesian', 'Italian', 'Japanese',
    'Korean', 'Malay', 'Marathi', 'Polish', 'Portuguese', 'Punjabi', 'Russian',
    'Spanish', 'Tamil', 'Telugu', 'Thai', 'Turkish', 'Urdu', 'Vietnamese'
];

const HISTORY_STORAGE_KEY = 'plant_doctor_ai_history';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Home);
  const [image, setImage] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<'plant' | 'soil'>('plant');
  
  // Analysis state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [translatedAnalysisResult, setTranslatedAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isViewingHistoryDetail, setIsViewingHistoryDetail] = useState<boolean>(false);

  // Soil analysis state
  const [soilAnalysisResult, setSoilAnalysisResult] = useState<SoilAnalysisResult | null>(null);
  const [translatedSoilAnalysisResult, setTranslatedSoilAnalysisResult] = useState<SoilAnalysisResult | null>(null);
  const [isAnalyzingSoil, setIsAnalyzingSoil] = useState<boolean>(false);
  const [soilAnalysisError, setSoilAnalysisError] = useState<string | null>(null);


  // Care tips state
  const [careTips, setCareTips] = useState<CareTip[] | null>(null);
  const [translatedCareTips, setTranslatedCareTips] = useState<CareTip[] | null>(null);
  const [isLoadingTips, setIsLoadingTips] = useState<boolean>(false);
  const [tipsError, setTipsError] = useState<string | null>(null);

  // Translation state
  const [language, setLanguage] = useState<string>(SUPPORTED_LANGUAGES.find(l => l === 'English') || SUPPORTED_LANGUAGES[0]);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
  }, []);

  const handleAnalyzeRequest = useCallback(async (imageData: string) => {
    setImage(imageData);
    setView(View.Analyzing);
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    setIsViewingHistoryDetail(false);
    setLanguage(SUPPORTED_LANGUAGES.find(l => l === 'English') || SUPPORTED_LANGUAGES[0]);
    setTranslatedAnalysisResult(null);

    try {
      const result = await analyzePlantHealth(imageData);
      setAnalysisResult(result);
      setView(View.Result);

      // Save to history
      const newHistoryItem: AnalysisHistoryItem = {
        id: Date.now().toString(),
        image: imageData,
        date: new Date().toISOString(),
        analysis: result,
      };
      setHistory(prevHistory => {
        const updatedHistory = [newHistoryItem, ...prevHistory];
        try {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
        } catch (error) {
          console.error("Failed to save history to localStorage:", error);
        }
        return updatedHistory;
      });

    } catch (err) {
      setAnalysisError('Sorry, we couldn\'t analyze your plant. Please try again.');
      setView(View.Result); // Go to result screen to show error
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleAnalyzeSoilRequest = useCallback(async (imageData: string) => {
    setImage(imageData);
    setView(View.AnalyzingSoil);
    setIsAnalyzingSoil(true);
    setSoilAnalysisError(null);
    setSoilAnalysisResult(null);
    setLanguage(SUPPORTED_LANGUAGES.find(l => l === 'English') || SUPPORTED_LANGUAGES[0]);
    setTranslatedSoilAnalysisResult(null);

    try {
      const result = await analyzeSoil(imageData);
      setSoilAnalysisResult(result);
      setView(View.SoilResult);
    } catch (err) {
      setSoilAnalysisError('Sorry, we couldn\'t analyze your soil. Please try again.');
      setView(View.SoilResult);
    } finally {
      setIsAnalyzingSoil(false);
    }
  }, []);

  const handleNavigateToScan = useCallback(() => {
    setScanMode('plant');
    setAnalysisError(null);
    setImage(null);
    setAnalysisResult(null);
    setIsViewingHistoryDetail(false);
    setView(View.Scan);
  }, []);

  const handleNavigateToSoilScan = useCallback(() => {
    setScanMode('soil');
    setSoilAnalysisError(null);
    setImage(null);
    setSoilAnalysisResult(null);
    setView(View.SoilScan);
  }, []);

  const handleNavigateToCamera = useCallback(() => {
    setAnalysisError(null);
    setSoilAnalysisError(null);
    setView(View.Camera);
  }, []);

  const handleBackToScan = useCallback(() => {
    if (scanMode === 'soil') {
        setView(View.SoilScan);
    } else {
        setView(View.Scan);
    }
  }, [scanMode]);
  
  const handleBackToHome = useCallback(() => {
    setView(View.Home);
  }, []);
  
  const handleNavigateToCareTips = useCallback(async () => {
    setView(View.CareTips);
    setLanguage(SUPPORTED_LANGUAGES.find(l => l === 'English') || SUPPORTED_LANGUAGES[0]);
    setTranslatedCareTips(null);

    if (careTips) return; // Don't re-fetch

    setIsLoadingTips(true);
    setTipsError(null);
    try {
        const fetchedTips = await fetchGeneralCareTips();
        setCareTips(fetchedTips);
    } catch (err) {
        setTipsError('Could not fetch care tips. Please try again later.');
    } finally {
        setIsLoadingTips(false);
    }
  }, [careTips]);

  const handleLanguageChange = useCallback(async (newLanguage: string) => {
    setLanguage(newLanguage);
    
    if (newLanguage === 'English') {
      setTranslatedAnalysisResult(null);
      setTranslatedCareTips(null);
      setTranslatedSoilAnalysisResult(null);
      return;
    }

    setIsTranslating(true);
    try {
      if ((view === View.Result || view === View.Analyzing) && analysisResult) {
        setTranslatedCareTips(null);
        setTranslatedSoilAnalysisResult(null);
        const translated = await translateAnalysisResult(analysisResult, newLanguage);
        setTranslatedAnalysisResult(translated);
      } else if (view === View.CareTips && careTips) {
        setTranslatedAnalysisResult(null);
        setTranslatedSoilAnalysisResult(null);
        const translated = await translateCareTips(careTips, newLanguage);
        setTranslatedCareTips(translated);
      } else if ((view === View.SoilResult || view === View.AnalyzingSoil) && soilAnalysisResult) {
        setTranslatedAnalysisResult(null);
        setTranslatedCareTips(null);
        const translated = await translateSoilAnalysisResult(soilAnalysisResult, newLanguage);
        setTranslatedSoilAnalysisResult(translated);
      }
    } catch (e) {
      console.error("Translation failed", e);
      // Here you could set an error state to show a toast message
    } finally {
      setIsTranslating(false);
    }
  }, [view, analysisResult, careTips, soilAnalysisResult]);

  const handleNavigateToHistory = useCallback(() => {
    setView(View.History);
  }, []);

  const handleViewHistoryItem = useCallback((item: AnalysisHistoryItem) => {
    setAnalysisResult(item.analysis);
    setImage(item.image);
    setIsViewingHistoryDetail(true);
    setLanguage(SUPPORTED_LANGUAGES.find(l => l === 'English') || SUPPORTED_LANGUAGES[0]);
    setTranslatedAnalysisResult(null);
    setView(View.Result);
  }, []);

  const handleClearHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your entire analysis history? This cannot be undone.')) {
      // Use the functional update form of setState to prevent issues with stale state in callbacks.
      setHistory(() => []);
      try {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
      } catch (error) {
        console.error("Failed to clear history from localStorage:", error);
      }
    }
  }, []);


  const renderView = () => {
    switch (view) {
      case View.Home:
        return <HomeScreen 
                  onNavigateToScan={handleNavigateToScan} 
                  onNavigateToSoilScan={handleNavigateToSoilScan}
                  onNavigateToCareTips={handleNavigateToCareTips}
                  onNavigateToHistory={handleNavigateToHistory} 
                />;
      case View.Scan:
        return <ScanScreen 
                  onAnalyze={handleAnalyzeRequest} 
                  error={analysisError}
                  onNavigateToCamera={handleNavigateToCamera}
                />;
      case View.SoilScan:
        return <SoilScanScreen
                  onAnalyze={handleAnalyzeSoilRequest}
                  error={soilAnalysisError}
                  onNavigateToCamera={handleNavigateToCamera}
                />;
      case View.Camera:
        return <CameraScreen onAnalyze={scanMode === 'plant' ? handleAnalyzeRequest : handleAnalyzeSoilRequest} onBack={handleBackToScan} />;
      case View.CareTips:
        return <CareTipsScreen 
                tips={translatedCareTips || careTips}
                isLoading={isLoadingTips}
                error={tipsError}
                language={language}
                onLanguageChange={handleLanguageChange}
                isTranslating={isTranslating}
                />;
      case View.History:
        return <HistoryScreen 
                  history={history}
                  onViewItem={handleViewHistoryItem}
                  onClearHistory={handleClearHistory}
                />;
      case View.Analyzing:
      case View.Result:
        return (
          <AnalysisScreen
            isLoading={isAnalyzing}
            analysisResult={translatedAnalysisResult || analysisResult}
            image={image}
            onDoneAction={isViewingHistoryDetail ? handleNavigateToHistory : handleNavigateToScan}
            onDoneLabel={isViewingHistoryDetail ? 'Back to History' : 'Scan Another Plant'}
            error={analysisError}
            language={language}
            onLanguageChange={handleLanguageChange}
            isTranslating={isTranslating}
          />
        );
      case View.AnalyzingSoil:
      case View.SoilResult:
        return (
            <SoilAnalysisScreen
                isLoading={isAnalyzingSoil}
                analysisResult={translatedSoilAnalysisResult || soilAnalysisResult}
                image={image}
                onDoneAction={handleNavigateToSoilScan}
                error={soilAnalysisError}
                language={language}
                onLanguageChange={handleLanguageChange}
                isTranslating={isTranslating}
            />
        );
      default:
        return <HomeScreen 
                  onNavigateToScan={handleNavigateToScan} 
                  onNavigateToSoilScan={handleNavigateToSoilScan}
                  onNavigateToCareTips={handleNavigateToCareTips} 
                  onNavigateToHistory={handleNavigateToHistory}
                />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5fbf5] font-sans text-gray-800">
      <Header />
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto relative">
            {view !== View.Home && view !== View.Camera && (
             <div className="absolute -top-2 -left-2 z-10">
                <button onClick={handleBackToHome} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors" aria-label="Back to Home">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
            </div>
          )}
          {renderView()}
        </div>
      </main>
      <div className="fixed bottom-4 right-4">
          <button className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors">
              <QuestionMarkCircleIcon className="w-8 h-8 text-gray-500" />
          </button>
      </div>
    </div>
  );
};

export default App;
