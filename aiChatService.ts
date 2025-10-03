
import { AIResponse, ChatMessage } from '../types';

// Simulated AI responses for common technical issues
const aiResponses: { [key: string]: AIResponse } = {
  // Download issues
  'téléchargement': {
    message: 'Je comprends que vous avez des difficultés avec le téléchargement. Voici quelques solutions :\n\n1. Vérifiez votre connexion internet\n2. Essayez de rafraîchir la page\n3. Videz le cache de votre navigateur\n\nSi le problème persiste, je peux vous mettre en contact avec notre équipe technique.',
    confidence: 0.9,
    suggestions: ['Problème de connexion', 'Cache du navigateur', 'Contacter le support']
  },
  'download': {
    message: 'I understand you\'re having download issues. Here are some solutions:\n\n1. Check your internet connection\n2. Try refreshing the page\n3. Clear your browser cache\n\nIf the problem persists, I can connect you with our technical team.',
    confidence: 0.9,
    suggestions: ['Connection issue', 'Browser cache', 'Contact support']
  },
  
  // Payment issues
  'paiement': {
    message: 'Pour les problèmes de paiement :\n\n1. Vérifiez que votre carte n\'est pas expirée\n2. Assurez-vous d\'avoir suffisamment de fonds\n3. Contactez votre banque si nécessaire\n\nNous acceptons : Cartes bancaires, PayPal, Orange Money, MTN MoMo, Wave et Bitcoin.',
    confidence: 0.85,
    suggestions: ['Carte expirée', 'Fonds insuffisants', 'Autres moyens de paiement']
  },
  'payment': {
    message: 'For payment issues:\n\n1. Check that your card is not expired\n2. Ensure you have sufficient funds\n3. Contact your bank if necessary\n\nWe accept: Bank cards, PayPal, Orange Money, MTN MoMo, Wave and Bitcoin.',
    confidence: 0.85,
    suggestions: ['Expired card', 'Insufficient funds', 'Other payment methods']
  },

  // Account issues
  'compte': {
    message: 'Pour les problèmes de compte :\n\n1. Vérifiez votre email de confirmation\n2. Essayez de réinitialiser votre mot de passe\n3. Vérifiez vos spams\n\nVotre compte est-il vérifié ?',
    confidence: 0.8,
    suggestions: ['Email de confirmation', 'Réinitialiser mot de passe', 'Vérifier spams']
  },
  'account': {
    message: 'For account issues:\n\n1. Check your confirmation email\n2. Try resetting your password\n3. Check your spam folder\n\nIs your account verified?',
    confidence: 0.8,
    suggestions: ['Confirmation email', 'Reset password', 'Check spam']
  },

  // App issues
  'application': {
    message: 'Pour les problèmes d\'application :\n\n1. Fermez et rouvrez l\'application\n2. Vérifiez les mises à jour disponibles\n3. Redémarrez votre appareil\n\nQuel type de problème rencontrez-vous exactement ?',
    confidence: 0.75,
    suggestions: ['Redémarrer l\'app', 'Mise à jour', 'Redémarrer appareil']
  },
  'app': {
    message: 'For app issues:\n\n1. Close and reopen the app\n2. Check for available updates\n3. Restart your device\n\nWhat type of problem are you experiencing exactly?',
    confidence: 0.75,
    suggestions: ['Restart app', 'Update', 'Restart device']
  },

  // Subscription issues
  'abonnement': {
    message: 'Concernant votre abonnement :\n\n• Période d\'essai : 7 jours gratuits\n• Plans disponibles : Basique (9.99€), Premium (19.99€), Entreprise (49.99€)\n• Annulation possible à tout moment\n\nQue souhaitez-vous savoir sur votre abonnement ?',
    confidence: 0.9,
    suggestions: ['Changer de plan', 'Annuler abonnement', 'Facturation']
  },
  'subscription': {
    message: 'About your subscription:\n\n• Trial period: 7 days free\n• Available plans: Basic (€9.99), Premium (€19.99), Enterprise (€49.99)\n• Cancellation possible anytime\n\nWhat would you like to know about your subscription?',
    confidence: 0.9,
    suggestions: ['Change plan', 'Cancel subscription', 'Billing']
  }
};

const defaultResponse: AIResponse = {
  message: 'Je comprends votre préoccupation. Pouvez-vous me donner plus de détails sur le problème que vous rencontrez ? Je suis là pour vous aider avec :\n\n• Problèmes de téléchargement\n• Questions de paiement\n• Gestion de compte\n• Problèmes techniques\n• Questions d\'abonnement',
  confidence: 0.5,
  suggestions: ['Téléchargement', 'Paiement', 'Compte', 'Technique', 'Abonnement'],
  escalateToHuman: false
};

export class AIChatService {
  static async processMessage(message: string): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerMessage = message.toLowerCase();
    
    // Find matching response based on keywords
    for (const [keyword, response] of Object.entries(aiResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    // Check for escalation keywords
    const escalationKeywords = ['humain', 'human', 'agent', 'personne', 'person', 'urgent', 'important'];
    const shouldEscalate = escalationKeywords.some(keyword => lowerMessage.includes(keyword));

    if (shouldEscalate) {
      return {
        message: 'Je comprends que vous souhaitez parler à un agent humain. Je vais transférer votre demande à notre équipe de support. Un agent vous contactera dans les plus brefs délais.',
        confidence: 0.95,
        escalateToHuman: true
      };
    }

    // Return default response
    return defaultResponse;
  }

  static generateWelcomeMessage(): ChatMessage {
    return {
      _id: Date.now(),
      text: 'Bonjour ! 👋 Je suis l\'assistant IA de Digigate. Je suis là pour vous aider avec vos questions techniques et préoccupations. Comment puis-je vous aider aujourd\'hui ?',
      createdAt: new Date(),
      user: {
        _id: 'ai-assistant',
        name: 'Assistant Digigate',
        avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100'
      },
      system: true
    };
  }

  static generateQuickReplies(): string[] {
    return [
      'Problème de téléchargement',
      'Question sur le paiement',
      'Gérer mon abonnement',
      'Problème technique',
      'Parler à un agent'
    ];
  }
}
