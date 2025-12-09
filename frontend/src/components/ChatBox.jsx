import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { chatAPI } from '../services/apiService';
import Button from './Button';
import '../styles/ChatBox.css';

/**
 * Chat box component for activity messaging.
 */
const ChatBox = ({ activityId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const pollingInterval = useRef(null);

    // Get current user from Redux store
    const { user } = useSelector((state) => state.auth);
    // Support both userId and id fields for compatibility
    const currentUserId = user?.userId || user?.id;

    useEffect(() => {
        loadMessages();
        startPolling();

        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current);
            }
        };
    }, [activityId]);

    const loadMessages = async () => {
        setLoading(true);
        try {
            const response = await chatAPI.getMessages(activityId);
            setMessages(response.data || []);
            scrollToBottom();
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const startPolling = () => {
        pollingInterval.current = setInterval(() => {
            pollNewMessages();
        }, 3000); // Poll every 3 seconds
    };

    const pollNewMessages = async () => {
        if (messages.length === 0) return;

        try {
            const lastMessage = messages[messages.length - 1];
            const response = await chatAPI.pollNewMessages(activityId, lastMessage.timestamp);

            if (response.data && response.data.length > 0) {
                setMessages((prev) => [...prev, ...response.data]);
                scrollToBottom();
            }
        } catch (error) {
            console.error('Polling failed:', error);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const response = await chatAPI.sendMessage(activityId, newMessage);
            setMessages((prev) => [...prev, response.data]);
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Check if message is from current user
    const isOwnMessage = (message) => {
        // Compare senderId with current user's ID
        // Handle both number and string comparison
        return message.senderId && currentUserId &&
            String(message.senderId) === String(currentUserId);
    };

    if (loading) {
        return (
            <div className="chat-loading">
                <div className="spinner spinner-sm"></div>
                <p>Loading chat...</p>
            </div>
        );
    }

    return (
        <div className="chat-box">
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        <p className="text-muted">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwn = isOwnMessage(message);
                        return (
                            <div
                                key={message.id}
                                className={`chat-message ${isOwn ? 'own-message' : 'other-message'}`}
                            >
                                {/* Show sender name for ALL messages */}
                                <div className="message-sender">
                                    {isOwn ? 'You' : message.senderName}
                                </div>
                                <div className="message-content">
                                    <p>{message.content}</p>
                                    <span className="message-time">{formatTime(message.timestamp)}</span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="chat-input-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                    disabled={sending}
                />
                <Button type="submit" variant="secondary" loading={sending} disabled={!newMessage.trim()}>
                    Send
                </Button>
            </form>
        </div>
    );
};

export default ChatBox;
