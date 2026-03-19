import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { ChevronLeft, VideoOff } from 'lucide-react';

const MeetingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [loading, setLoading] = useState(true);

  // A minimal layout wrapper so it matches the app's aesthetic while putting focus on the video
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
            title="Leave Meeting"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Sliq Meeting</h1>
            <p className="text-sm text-gray-500 font-medium">Room: {roomId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold shrink-0">
            {userInfo.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      {/* Main Jitsi Container */}
      <div className="flex-1 w-full bg-black relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
             <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
               <p className="text-white font-medium">Initializing secure connection...</p>
             </div>
          </div>
        )}
        
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={`sliq-${roomId}`}
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: true,
            startScreenSharing: true,
            enableEmailInStats: false
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
          }}
          userInfo={{
            displayName: userInfo.name || 'Sliq Member',
            email: userInfo.email
          }}
          onApiReady={() => {
            // When iframe is loaded, hide the global spinner
            setTimeout(() => setLoading(false), 1500); 
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
            iframeRef.style.border = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default MeetingPage;
