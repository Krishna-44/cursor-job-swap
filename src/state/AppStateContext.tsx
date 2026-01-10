import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  User,
  Match,
  SwapRequest,
  HRRequest,
  mockUser,
  mockMatches,
  initialSwapRequestsOutgoing,
  initialSwapRequestsIncoming,
  initialHRRequests,
  generateId
} from '@/mock/data';

// =====================================================
// STATE TYPES
// =====================================================
interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  profile: Partial<User>;
  matches: Match[];
  swapRequestsOutgoing: SwapRequest[];
  swapRequestsIncoming: SwapRequest[];
  hrRequests: HRRequest[];
  isLoading: boolean;
}

// =====================================================
// ACTION TYPES
// =====================================================
type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'COMPLETE_PROFILE'; payload: User }
  | { type: 'SET_MATCHES'; payload: Match[] }
  | { type: 'SEND_SWAP_REQUEST'; payload: { matchId: string; message: string; shareResume: boolean; shareContact: boolean } }
  | { type: 'ACCEPT_INCOMING_REQUEST'; payload: string }
  | { type: 'DECLINE_INCOMING_REQUEST'; payload: string }
  | { type: 'HR_APPROVE'; payload: string }
  | { type: 'HR_REJECT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'DEMO_LOGIN' };

// =====================================================
// INITIAL STATE
// =====================================================
const initialState: AppState = {
  currentUser: null,
  isAuthenticated: false,
  profile: {},
  matches: [],
  swapRequestsOutgoing: [],
  swapRequestsIncoming: [],
  hrRequests: [],
  isLoading: false
};

// =====================================================
// REDUCER
// =====================================================
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    
    case 'COMPLETE_PROFILE':
      return { 
        ...state, 
        currentUser: action.payload,
        profile: action.payload
      };
    
    case 'SET_MATCHES':
      return { ...state, matches: action.payload };
    
    case 'SEND_SWAP_REQUEST': {
      const match = state.matches.find(m => m.id === action.payload.matchId);
      if (!match || !state.currentUser) return state;

      const newRequest: SwapRequest = {
        id: generateId(),
        matchId: action.payload.matchId,
        fromUserId: state.currentUser.id,
        fromUserName: state.currentUser.name,
        fromUserCompany: state.currentUser.company,
        fromUserJobTitle: state.currentUser.jobTitle,
        fromUserSkills: state.currentUser.skills,
        toUserId: match.userId,
        toUserName: match.name,
        toUserCompany: match.company,
        toUserJobTitle: match.jobTitle,
        message: action.payload.message,
        status: 'pending',
        shareResume: action.payload.shareResume,
        shareContact: action.payload.shareContact,
        compatibilityScore: match.compatibilityScore,
        commuteSavingsMinutes: match.commuteBeforeMinutes - match.commuteAfterMinutes,
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        swapRequestsOutgoing: [...state.swapRequestsOutgoing, newRequest]
      };
    }
    
    case 'ACCEPT_INCOMING_REQUEST': {
      const updatedIncoming = state.swapRequestsIncoming.map(req =>
        req.id === action.payload
          ? { ...req, status: 'peer_accepted' as const }
          : req
      );

      // Move to HR queue
      const acceptedRequest = state.swapRequestsIncoming.find(req => req.id === action.payload);
      let updatedHR = state.hrRequests;
      
      if (acceptedRequest) {
        const hrRequest: HRRequest = {
          ...acceptedRequest,
          status: 'hr_review',
          estimatedCostSavings: acceptedRequest.commuteSavingsMinutes * 25 // $25/hour estimate
        };
        updatedHR = [...state.hrRequests, hrRequest];
      }

      return {
        ...state,
        swapRequestsIncoming: updatedIncoming,
        hrRequests: updatedHR
      };
    }
    
    case 'DECLINE_INCOMING_REQUEST':
      return {
        ...state,
        swapRequestsIncoming: state.swapRequestsIncoming.filter(req => req.id !== action.payload)
      };
    
    case 'HR_APPROVE':
      return {
        ...state,
        hrRequests: state.hrRequests.map(req =>
          req.id === action.payload
            ? { ...req, status: 'approved' as const }
            : req
        )
      };
    
    case 'HR_REJECT':
      return {
        ...state,
        hrRequests: state.hrRequests.map(req =>
          req.id === action.payload
            ? { ...req, status: 'rejected' as const }
            : req
        )
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'DEMO_LOGIN':
      return {
        ...state,
        currentUser: mockUser,
        isAuthenticated: true,
        profile: mockUser,
        matches: mockMatches,
        swapRequestsOutgoing: initialSwapRequestsOutgoing,
        swapRequestsIncoming: initialSwapRequestsIncoming,
        hrRequests: initialHRRequests
      };
    
    default:
      return state;
  }
}

// =====================================================
// CONTEXT
// =====================================================
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Convenience actions
  login: (provider: 'linkedin' | 'google' | 'email' | 'demo') => void;
  logout: () => void;
  sendSwapRequest: (matchId: string, payload: { message: string; shareResume: boolean; shareContact: boolean }) => void;
  acceptIncomingRequest: (requestId: string) => void;
  declineIncomingRequest: (requestId: string) => void;
  hrApprove: (requestId: string) => void;
  hrReject: (requestId: string) => void;
  updateProfile: (data: Partial<User>) => void;
  completeProfile: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// =====================================================
// PROVIDER
// =====================================================
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = (provider: 'linkedin' | 'google' | 'email' | 'demo') => {
    if (provider === 'demo') {
      dispatch({ type: 'DEMO_LOGIN' });
    } else {
      // For other providers, just authenticate without full profile
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    }
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
  };

  const sendSwapRequest = (matchId: string, payload: { message: string; shareResume: boolean; shareContact: boolean }) => {
    dispatch({ type: 'SEND_SWAP_REQUEST', payload: { matchId, ...payload } });
  };

  const acceptIncomingRequest = (requestId: string) => {
    dispatch({ type: 'ACCEPT_INCOMING_REQUEST', payload: requestId });
  };

  const declineIncomingRequest = (requestId: string) => {
    dispatch({ type: 'DECLINE_INCOMING_REQUEST', payload: requestId });
  };

  const hrApprove = (requestId: string) => {
    dispatch({ type: 'HR_APPROVE', payload: requestId });
  };

  const hrReject = (requestId: string) => {
    dispatch({ type: 'HR_REJECT', payload: requestId });
  };

  const updateProfile = (data: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: data });
  };

  const completeProfile = (user: User) => {
    dispatch({ type: 'COMPLETE_PROFILE', payload: user });
    dispatch({ type: 'SET_MATCHES', payload: mockMatches });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      login,
      logout,
      sendSwapRequest,
      acceptIncomingRequest,
      declineIncomingRequest,
      hrApprove,
      hrReject,
      updateProfile,
      completeProfile
    }}>
      {children}
    </AppContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================
export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
