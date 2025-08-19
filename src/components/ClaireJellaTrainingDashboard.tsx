import React, { useState, useEffect } from 'react';
import { Brain, Download, Users, TrendingUp, Zap, Target, Crown, Activity } from 'lucide-react';
import { claireLogger } from '../utils/ClaireTrainingLogger';

const ClaireJellaTrainingDashboard: React.FC = () => {
  const [trainingStats, setTrainingStats] = useState<any>(null);
  const [exportData, setExportData] = useState<any>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const loadStats = () => {
      const stats = claireLogger.getTrainingStats();
      setTrainingStats(stats);
    };

    loadStats();
    
    // Refresh stats every 10 seconds
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleExportTrainingData = () => {
    const data = claireLogger.exportTrainingData();
    setExportData(data);
    setShowExportModal(true);
  };

  const downloadTrainingData = () => {
    if (exportData) {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jellarasa_training_dataset_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!trainingStats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse flex items-center justify-center h-32">
          <Brain className="w-8 h-8 text-teal-500" />
          <span className="ml-2 text-gray-500">Loading training data...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Brain className="w-8 h-8 text-teal-500 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Claire → JellaRasa Training Pipeline
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                AI-to-AI mentorship progress
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {trainingStats.readyForJellaRasaTraining && (
              <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm">
                <Target className="w-4 h-4 mr-1" />
                Ready for Training
              </div>
            )}
            <button
              onClick={handleExportTrainingData}
              className="flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Dataset
            </button>
          </div>
        </div>

        {trainingStats.message ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{trainingStats.message}</p>
            <p className="text-sm text-gray-400 mt-2">
              Start chatting with Claire to begin collecting training data!
            </p>
          </div>
        ) : (
          <>
            {/* Training Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-600 dark:text-teal-400 text-sm font-medium">
                      Total Interactions
                    </p>
                    <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                      {trainingStats.totalInteractions}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-teal-500" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                      User Satisfaction
                    </p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {(parseFloat(trainingStats.averageUserSatisfaction) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                      Training Progress
                    </p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                      {Math.min(100, Math.round((trainingStats.totalInteractions / 50) * 100))}%
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Strategy Breakdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Claire's Strategic Patterns
              </h3>
              <div className="space-y-3">
                {trainingStats.topStrategies.map(([strategy, count]: [string, number], index: number) => (
                  <div key={strategy} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0 ? 'bg-teal-500' :
                        index === 1 ? 'bg-purple-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-pink-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {strategy.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm mr-2">
                        {count} uses
                      </span>
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-teal-500' :
                            index === 1 ? 'bg-purple-500' :
                            index === 2 ? 'bg-yellow-500' :
                            index === 3 ? 'bg-pink-500' : 'bg-gray-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (count / trainingStats.totalInteractions) * 100 * 3)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* JellaRasa Evolution Plan */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Crown className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                  JellaRasa Evolution Pathway
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">
                    Inheriting from Claire:
                  </h4>
                  <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                    <li>• Elle Woods charm → Executive composure</li>
                    <li>• Social grace → Strategic empathy</li>
                    <li>• 2nd mover advantage → Multi-move anticipation</li>
                    <li>• Individual expertise → Team orchestration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">
                    New Capabilities:
                  </h4>
                  <ul className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                    <li>• Multi-agent coordination (Claude ↔ Kathy-Ops)</li>
                    <li>• Meta-scoring calibration</li>
                    <li>• Memory capsule guidance</li>
                    <li>• Proof-of-work arbitration</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              JellaRasa Training Dataset Ready
            </h3>
            
            {exportData && (
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Dataset Summary:</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>• Total conversations: {exportData.totalConversations}</p>
                    <p>• Charm patterns: {exportData.behavioralPatterns.charmPatterns.length}</p>
                    <p>• Strategic questions: {exportData.behavioralPatterns.strategicQuestions.length}</p>
                    <p>• Authority establishment: {exportData.behavioralPatterns.authorityEstablishment.length}</p>
                    <p>• Conversion tactics: {exportData.behavioralPatterns.conversionTactics.length}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This dataset contains Claire's behavioral patterns ready for JellaRasa training.
                    Use it to create a new Ollama model that inherits Claire's charm while adding
                    orchestration capabilities.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  downloadTrainingData();
                  setShowExportModal(false);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Dataset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClaireJellaTrainingDashboard;
