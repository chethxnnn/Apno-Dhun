import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './PatrikaModal.css';

export default function PatrikaModal({
  isOpen,
  onClose,
  currentTrack,
}) {
  const previewCardRef = useRef(null);
  const exportCardRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen || !currentTrack) return null;

  const thumbUrl = currentTrack
    ? `https://img.youtube.com/vi/${currentTrack.id}/hqdefault.jpg`
    : '/logo.png';

  const fullTitle = currentTrack.title || 'Rajasthani Song';
  const shareText = `Ram Ram Sa! I am listening to "${fullTitle}" on Apno Dhun.\n\nApne favourite Rajasthani geet yahan suno!\nhttps://apnodhun.in`;

  const handleSharePatrika = async () => {
    if (isSharing || !exportCardRef.current) return;
    setIsSharing(true);

    try {
      // Ensure fonts are ready before capturing export node
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (e) {}
      }

      // Capture the offscreen 1037x1516 full-res DOM node at scale: 2 for 2074x3032 4K resolution
      const canvas = await html2canvas(exportCardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        imageTimeout: 0,
      });

      canvas.toBlob(async (blob) => {
        setIsSharing(false);
        if (!blob) return;

        const file = new File([blob], `apno-dhun-patrika-hd-${Date.now()}.png`, { type: 'image/png' });

        // 1. Try Native Web Share API with image file attached
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Apno Dhun',
              text: shareText,
              files: [file],
            });
            return;
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.warn('Native image share failed, triggering download:', err);
            } else {
              return;
            }
          }
        }

        // 2. Fallback: Trigger browser image download
        triggerDownload(blob, file.name);
      }, 'image/png', 1.0);
    } catch (e) {
      console.warn('Patrika share error:', e);
      setIsSharing(false);
    }
  };

  const triggerDownload = (blob, fileName) => {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  return (
    <div className="patrika-backdrop" onClick={onClose}>
      <div className="patrika-modal-center" onClick={(e) => e.stopPropagation()}>
        {/* Royal Patrika Card Screen Preview */}
        <div className="patrika-card-blank-bg" ref={previewCardRef}>
          {/* Centered Clean Content */}
          <div className="blank-clean-content-lower">
            <div
              className="clean-thumb-wrap-larger"
              style={{ backgroundImage: `url(${thumbUrl})` }}
            />
            <h3 className="clean-song-title-compact">{currentTrack.title}</h3>
            <p className="clean-artist-name-red">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="patrika-actions">
          <button className="patrika-pill-btn share-pill" onClick={handleSharePatrika} disabled={isSharing}>
            {isSharing ? 'Generating Ultra HD Card...' : 'Share your Patrika'}
          </button>
          <button className="patrika-pill-btn notnow-pill" onClick={onClose}>
            Not now
          </button>
        </div>

        {/* Hidden 1037x1516 Native Export Node (100% Identical Parity with Screen Preview) */}
        <div
          ref={exportCardRef}
          style={{
            position: 'fixed',
            left: '-9999px',
            top: '-9999px',
            width: '1037px',
            height: '1516px',
            pointerEvents: 'none',
            zIndex: -999,
          }}
        >
          <div className="patrika-card-blank-bg-export">
            <div className="blank-clean-content-lower-export">
              <div
                className="clean-thumb-wrap-larger-export"
                style={{ backgroundImage: `url(${thumbUrl})` }}
              />
              <h3 className="clean-song-title-compact-export">{currentTrack.title}</h3>
              <p className="clean-artist-name-red-export">{currentTrack.artist}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
