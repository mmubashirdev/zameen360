import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MessagesSidebar from "../components/MessagesSidebar";
import ChatWindow from "../components/ChatWindow";


interface NewConversationContext {
  sellerId: number;
  propertyId: number;
  sellerName?: string;
  sellerAvatar?: string;
}

const MessagesPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [newConversationContext, setNewConversationContext] =
    useState<NewConversationContext | null>(null);
  // Incrementing this tells MessagesSidebar to refetch its list
  const [sidebarRefreshTrigger, setSidebarRefreshTrigger] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // Read navigation state once on mount, then clear it so refresh doesn't re-trigger
  useEffect(() => {
    const state = location.state as NewConversationContext | null;
    if (state?.sellerId) {
      setNewConversationContext(state);
      navigate(location.pathname, { replace: true, state: null });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConversationCreated = (id: number) => {
    setSelectedConversationId(id);
    setNewConversationContext(null); // exit "new conversation" mode
    setSidebarRefreshTrigger((n) => n + 1); // make sidebar refetch
  };

  const handleSelectConversation = (id: number) => {
    setSelectedConversationId(id);
    if (newConversationContext) setNewConversationContext(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-[1500px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-5 h-[calc(100vh-120px)]">
          {/* Left Sidebar - Conversations list */}
          <div className="col-span-3">
            <MessagesSidebar
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              newConversationContext={newConversationContext}
              refreshTrigger={sidebarRefreshTrigger}
            />
          </div>

          {/* Center - Chat Window */}
          <div className="col-span-6">
            <ChatWindow
              conversationId={selectedConversationId}
              newConversationContext={newConversationContext}
              onConversationCreated={handleConversationCreated}
            />
          </div>

         
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;