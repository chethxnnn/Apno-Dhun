import { useRef, useState } from 'react';
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

  // Helper function to wrap text into multiple lines for full song title on Canvas
  const wrapCanvasText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const handleSharePatrika = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      // 1. Create Canvas with native dimensions of dhun-card-blank.png (1037 x 1516)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1037;
      canvas.height = 1516;

      // Load Template Background Image
      const bgImg = new Image();
      bgImg.crossOrigin = 'Anonymous';
      bgImg.src = '/dhun-card-blank.png';

      await new Promise((res) => {
        bgImg.onload = res;
        bgImg.onerror = res;
      });

      // Draw Template Background
      try {
        ctx.drawImage(bgImg, 0, 0, 1037, 1516);
      } catch (e) {
        ctx.fillStyle = '#FAF1E6';
        ctx.fillRect(0, 0, 1037, 1516);
      }

      // 2. Larger Thumbnail Size (Width 560px, Height 315px - 16:9 HD ratio) - Shifted lower to Y = 515px
      const drawW = 560;
      const drawH = 315;
      const imgX = (1037 - drawW) / 2; // Exactly 238.5px
      const imgY = 515; // Shifted lower down as requested

      const trackImg = new Image();
      trackImg.crossOrigin = 'Anonymous';
      trackImg.src = thumbUrl;

      await new Promise((res) => {
        trackImg.onload = res;
        trackImg.onerror = res;
      });

      try {
        ctx.save();
        ctx.shadowColor = 'rgba(122, 14, 19, 0.3)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 10;

        ctx.beginPath();
        ctx.roundRect(imgX, imgY, drawW, drawH, 24);
        ctx.clip();
        ctx.drawImage(trackImg, imgX, imgY, drawW, drawH);
        ctx.restore();
      } catch (e) {}

      // 3. Full Song Title in Rich Red Thin Serif Font (Compact Width = 760px)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7A0E13'; // Crimson Red matching template aesthetic
      ctx.font = '300 38px "Playfair Display", Georgia, serif';

      const maxTextWidth = 760;
      const fullTitle = currentTrack.title || 'Rajasthani Song';
      const titleLines = wrapCanvasText(ctx, fullTitle, maxTextWidth);

      let textY = imgY + drawH + 42; // Offset below larger thumbnail

      // Draw ALL lines for the complete full title
      titleLines.forEach((line, idx) => {
        ctx.fillText(line, 1037 / 2, textY + idx * 46);
      });

      // 4. Artist Name in Soft Muted Red Thin Font (Center-Aligned)
      const artistY = textY + titleLines.length * 46 + 10;
      ctx.fillStyle = '#802025';
      ctx.font = '300 25px Inter, sans-serif';
      ctx.fillText(currentTrack.artist || 'Apna Culturez', 1037 / 2, artistY);

      // Convert Canvas to PNG File and Share Image
      canvas.toBlob(async (blob) => {
        setIsSharing(false);
        if (!blob) return;

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
      console.warn('Canvas share error:', e);
      setIsSharing(false);
    }
  };

  return (
    <div className="patrika-backdrop" onClick={onClose}>
      <div className="patrika-modal-center" onClick={(e) => e.stopPropagation()}>
        {/* Royal Patrika Card Modal with dhun-card-blank.png Background Template */}
        <div className="patrika-card-blank-bg" ref={cardRef}>
          {/* Centered Clean Content (Positioned lower down at 34%) */}
          <div className="blank-clean-content-lower">
            <div className="clean-thumb-wrap-larger">
              <img src={thumbUrl} alt="" className="clean-thumb-img" />
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
