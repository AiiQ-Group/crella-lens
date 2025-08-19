/**
 * 🤖✨ Claire Training Logger
 * Logs Claire's conversations automatically for JellaRasa training
 */

interface ConversationMetadata {
  sessionId: string;
  timestamp: string;
  userTone: string;
  claireTone: string;
  gtoDecision: string;
  paitContext?: string;
  vipConversionAttempt: boolean;
  privacyEducation: boolean;
  userSatisfaction: number;
}

interface ClaireBehaviorLog {
  responseId: string;
  userPrompt: string;
  claireResponse: string;
  strategyUsed: string;
  emotionalTone: string;
  conversionElements: string[];
  metadata: ConversationMetadata;
}

class ClaireTrainingLogger {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 8);
  }

  private generateResponseId(): string {
    return Math.random().toString(36).substr(2, 12);
  }

  public async logClaireInteraction(
    userPrompt: string, 
    claireResponse: string, 
    context: any = null
  ): Promise<string> {
    try {
      const responseId = this.generateResponseId();
      
      // Analyze conversation for metadata
      const userTone = this.analyzeUserTone(userPrompt);
      const claireTone = this.analyzeClaireT(claireResponse);
      const gtoDecision = this.analyzeGTOStrategy(userPrompt, claireResponse);
      
      const metadata: ConversationMetadata = {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        userTone,
        claireTone,
        gtoDecision,
        paitContext: context?.paitScore?.toString(),
        vipConversionAttempt: claireResponse.toLowerCase().includes('vip'),
        privacyEducation: claireResponse.toLowerCase().includes('privacy') || 
                         claireResponse.toLowerCase().includes('data'),
        userSatisfaction: this.estimateSatisfaction(userPrompt, claireResponse)
      };

      const behaviorLog: ClaireBehaviorLog = {
        responseId,
        userPrompt,
        claireResponse,
        strategyUsed: this.identifyStrategy(claireResponse),
        emotionalTone: this.analyzeEmotionalTone(claireResponse),
        conversionElements: this.extractConversionElements(claireResponse),
        metadata
      };

      // Store in localStorage for now (in production, send to backend)
      const existingLogs = JSON.parse(localStorage.getItem('claire-training-logs') || '[]');
      existingLogs.push(behaviorLog);
      
      // Keep only last 1000 logs
      if (existingLogs.length > 1000) {
        existingLogs.splice(0, existingLogs.length - 1000);
      }
      
      localStorage.setItem('claire-training-logs', JSON.stringify(existingLogs));
      
      console.log(`📚 Claire training log saved: ${responseId}`);
      return responseId;
    } catch (error) {
      console.error('Error logging Claire interaction:', error);
      return '';
    }
  }

  private analyzeUserTone(prompt: string): string {
    const promptLower = prompt.toLowerCase();
    
    if (['what', 'how', 'explain', 'tell me'].some(word => promptLower.includes(word))) {
      return 'curious';
    } else if (['hi', 'hello', 'thanks', 'thank you'].some(word => promptLower.includes(word))) {
      return 'friendly';
    } else if (prompt.includes('?') && prompt.length > 50) {
      return 'analytical';
    } else if (prompt.length < 20) {
      return 'passive';
    } else {
      return 'neutral';
    }
  }

  private analyzeClaireT(response: string): string {
    const responseLower = response.toLowerCase();
    
    if (['sweetie', 'darling', 'honey'].some(term => responseLower.includes(term))) {
      return 'charming';
    } else if (['stanford', 'thesis'].some(term => responseLower.includes(term))) {
      return 'academic';
    } else if (['curious', 'what brought you'].some(term => responseLower.includes(term))) {
      return 'strategic';
    } else if (['gorgeous', 'fabulous'].some(term => responseLower.includes(term))) {
      return 'enthusiastic';
    } else {
      return 'diplomatic';
    }
  }

  private analyzeGTOStrategy(prompt: string, response: string): string {
    const responseLower = response.toLowerCase();
    
    if (['what brought you', 'curious about'].some(phrase => responseLower.includes(phrase))) {
      return '2nd_mover_advantage';
    } else if (['love that you', 'exquisite instincts'].some(phrase => responseLower.includes(phrase))) {
      return 'charm_offensive';
    } else if (['stanford', 'learned'].some(term => responseLower.includes(term))) {
      return 'authority_establishment';
    } else if (response.length > 200 && response.includes('?')) {
      return 'information_gathering';
    } else {
      return 'passive_engagement';
    }
  }

  private identifyStrategy(response: string): string {
    const strategies: string[] = [];
    const responseLower = response.toLowerCase();
    
    if (responseLower.includes('what brought you')) strategies.push('2nd_mover_questioning');
    if (['sweetie', 'darling'].some(term => responseLower.includes(term))) strategies.push('charm_building');
    if (['stanford', 'sorority'].some(term => responseLower.includes(term))) strategies.push('credibility_establishment');
    if (responseLower.includes('vip')) strategies.push('value_demonstration');
    if (['privacy', 'data'].some(term => responseLower.includes(term))) strategies.push('values_alignment');
    
    return strategies.length > 0 ? strategies.join('_') : 'basic_response';
  }

  private analyzeEmotionalTone(response: string): string {
    const responseLower = response.toLowerCase();
    const exclamationCount = (response.match(/!/g) || []).length;
    
    if (exclamationCount > 2 || responseLower.includes('gorgeous')) {
      return 'enthusiastic';
    } else if (responseLower.includes('sweetie') && responseLower.includes('curious')) {
      return 'warm_strategic';
    } else if (['stanford', 'thesis'].some(term => responseLower.includes(term))) {
      return 'confident_academic';
    } else if (responseLower.includes('darling')) {
      return 'diplomatic_warm';
    } else {
      return 'professional_friendly';
    }
  }

  private extractConversionElements(response: string): string[] {
    const elements: string[] = [];
    const responseLower = response.toLowerCase();
    
    if (responseLower.includes('vip')) elements.push('vip_mention');
    if (['50%', 'more accurate'].some(term => responseLower.includes(term))) elements.push('quantified_benefit');
    if (['tiffany', 'mall jewelry'].some(term => responseLower.includes(term))) elements.push('luxury_analogy');
    if (['privacy', 'data sovereignty'].some(term => responseLower.includes(term))) elements.push('privacy_value_prop');
    if (['stanford', 'sorority'].some(term => responseLower.includes(term))) elements.push('credibility_signal');
    
    return elements;
  }

  private estimateSatisfaction(prompt: string, response: string): number {
    let score = 0.5; // baseline
    
    // Positive indicators
    if (response.length > 100) score += 0.1; // Detailed response
    if ((response.match(/\?/g) || []).length > 0) score += 0.2; // Engaging questions
    if (['sweetie', 'darling', 'gorgeous'].some(term => response.toLowerCase().includes(term))) score += 0.1;
    if (['curious', 'brought you'].some(term => response.toLowerCase().includes(term))) score += 0.2;
    
    return Math.min(1.0, score);
  }

  public exportTrainingData(): any {
    const logs = JSON.parse(localStorage.getItem('claire-training-logs') || '[]');
    
    const trainingData = {
      totalConversations: logs.length,
      behavioralPatterns: {
        charmPatterns: logs.filter((log: ClaireBehaviorLog) => log.strategyUsed.includes('charm')),
        strategicQuestions: logs.filter((log: ClaireBehaviorLog) => log.strategyUsed.includes('2nd_mover')),
        authorityEstablishment: logs.filter((log: ClaireBehaviorLog) => log.strategyUsed.includes('credibility')),
        conversionTactics: logs.filter((log: ClaireBehaviorLog) => log.claireResponse.toLowerCase().includes('vip'))
      },
      jellarasaEvolutionTargets: {
        charm_to_composure: 'Maintain warmth but add executive gravitas',
        social_grace_to_strategic_empathy: 'Deeper system-wide optimization understanding',
        second_mover_to_multi_move: 'Anticipate conversation trajectories across AI agents',
        individual_to_orchestration: 'Coordinate multiple AI models seamlessly'
      },
      exportTimestamp: new Date().toISOString()
    };
    
    return trainingData;
  }

  public getTrainingStats(): any {
    const logs = JSON.parse(localStorage.getItem('claire-training-logs') || '[]');
    
    if (logs.length === 0) {
      return { message: 'No training data available yet' };
    }

    const strategies = logs.reduce((acc: any, log: ClaireBehaviorLog) => {
      acc[log.strategyUsed] = (acc[log.strategyUsed] || 0) + 1;
      return acc;
    }, {});

    const avgSatisfaction = logs.reduce((sum: number, log: ClaireBehaviorLog) => 
      sum + log.metadata.userSatisfaction, 0) / logs.length;

    return {
      totalInteractions: logs.length,
      averageUserSatisfaction: avgSatisfaction.toFixed(2),
      topStrategies: Object.entries(strategies)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5),
      readyForJellaRasaTraining: logs.length >= 50
    };
  }
}

// Export singleton instance
export const claireLogger = new ClaireTrainingLogger();
export default ClaireTrainingLogger;
