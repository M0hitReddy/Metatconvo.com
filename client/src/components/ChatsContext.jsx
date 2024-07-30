import React, { createContext, useMemo, useReducer } from 'react';
import { io } from 'socket.io-client';

// Define the initial state
const initialState = {
    socket: null,
    selectedChat: null,
    chats: [],
    messages: []
};

// Define the reducer function
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SOCKET':
            return {
                ...state,
                socket: action.payload
            };
        case 'SELECT_CHAT':
            return {
                ...state,
                selectedChat: action.payload
            };
        case 'SET_CHATS':
            return {
                ...state,
                chats: action.payload
            };
        case 'SET_MESSAGES':
            return {
                ...state,
                messages: action.payload
            };
        case 'ADD_CHAT':
            return {
                ...state,
                chats: [...state.chats, action.payload]
            };
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };
        default:
            return state;
    }
};

// Create the Chats context
const ChatsContext = createContext();

// Create the Chats context provider
export const ChatsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ChatsContext.Provider value={{ state, dispatch }}>
            {children}
        </ChatsContext.Provider>
    );
};

export const useChats = () => React.useContext(ChatsContext);