import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './PatrikaModal.css';

export default function PatrikaModal({
  isOpen,
  onClose,
  currentTrack,
}) {
  const cardRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen || !currentTrack) return null;

  const thumbUrl = currentTrack
    ? `https://img.youtube.com/vi/${currentTrack.id}/hqdefault.jpg`
    : '/logo.png';

  const handleSharePatrika = async () => {
    if (isSharing || !cardRef.current) return;
    setIsSharing(true);

    try {
      // Use html2canvas to render the EXACT preview card DOM node at 3x scale (~1037x1516)
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Ultra crisp high-definition export
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        setIsSharing(false);
        if (!blob) return;

        const fullTitle = currentTrack.title || 'Rajasthani Song';
        const file = new File([blob], `apno-dhun-patrika-${Date.now()}.png`, { type: 'image/png' });

        // 1. Try Native Web Share API with image file attached
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Apno Dhun Royal Patrika',
              text: `शाही निमंत्रण — Apno Dhun (${fullTitle}) https://apnodhun.in`,
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
        const link = document.createElement('a');
        link.download = file.name;
        link.href = URL.createObjectURL(blob);
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      }, 'image/png');
    } catch (e) {
      console.warn('Patrika html2canvas capture error:', e);
      setIsSharing(false);
    }
  };

  return (
    <div className="patrika-backdrop" onClick={onClose}>
      <div className="patrika-modal-center" onClick={(e) => e.stopPropagation()}>
        {/* Royal Patrika Card Modal with dhun-card-blank.png Background Template */}
        <div className="patrika-card-blank-bg" ref={cardRef}>
          {/* Centered Clean Content (Positioned in middle blank space) */}
          <div className="blank-clean-content-lower">
            <div className="clean-thumb-wrap-larger">
              <img src={thumbUrl} alt="" className="clean-thumb-img" crossOrigin="anonymous" />
            </div>

            <h3 className="clean-song-title-compact">{currentTrack.title}</h3>
            <p className="clean-artist-name-red">{currentTrack.artist}</p>
          </div>
        </div>

        {/* 2 Full-Width Pill Buttons */}
        <div className="patrika-actions">
          <button className="patrika-pill-btn share-pill" onClick={handleSharePatrika} disabled={isSharing}>
            {isSharing ? 'Generating Image...' : 'Share your Patrika'}
          </button>
          <button className="patrika-pill-btn notnow-pill" onClick={onClose}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
