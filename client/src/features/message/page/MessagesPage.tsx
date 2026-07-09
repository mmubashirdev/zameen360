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

// All possible navigation states coming into this page
interface LocationState {
  sellerId?: number;
  propertyId?: number;
  sellerName?: string;
  sellerAvatar?: string;
  openConversationId?: number; // ← from notification click
}

const MessagesPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [newConversationContext, setNewConversationContext] =
    useState<NewConversationContext | null>(null);
  const [sidebarRefreshTrigger, setSidebarRefreshTrigger] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // ─── Read navigation state once on mount ────────────────────────────────────
  useEffect(() => {
    const state = location.state as LocationState | null;

    if (state?.openConversationId) {
      // Came from notification click → open that conversation directly
      setSelectedConversationId(state.openConversationId);
      // Clear state so refresh doesn't re-trigger
      navigate(location.pathname, { replace: true, state: null });
    } else if (state?.sellerId) {
      // Came from property page → start or resume a conversation
      setNewConversationContext({
        sellerId: state.sellerId,
        propertyId: state.propertyId!,
        sellerName: state.sellerName,
        sellerAvatar: state.sellerAvatar,
      });
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  // Called by ChatWindow once the first message in a new conversation is sent
  const handleConversationCreated = (id: number) => {
    setSelectedConversationId(id);
    setNewConversationContext(null);
    // Tell sidebar to refetch its list
    setSidebarRefreshTrigger((n) => n + 1);
  };

  // Called by MessagesSidebar when user clicks a conversation row
  const handleSelectConversation = (id: number) => {
    setSelectedConversationId(id);
    // Exit "new conversation" mode if active
    if (newConversationContext) setNewConversationContext(null);
    // Tell the notification bell to refresh its count
    window.dispatchEvent(new CustomEvent("messages_marked_read"));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-375 mx-auto px-6 py-6" role="main">
        {/* ── Back Button ───────────────────────────────────────────────── */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back
          </button>
        </div>

        <div className="grid grid-cols-12 gap-5 h-[calc(100vh-160px)]" role="presentation">
          
          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <div className="col-span-3">
            <MessagesSidebar
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              newConversationContext={newConversationContext}
              refreshTrigger={sidebarRefreshTrigger}
            />
          </div>

          {/* ── Chat Window ───────────────────────────────────────────────── */}
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