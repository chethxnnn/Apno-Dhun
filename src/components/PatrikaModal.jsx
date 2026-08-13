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

  const fullTitle = currentTrack.title || 'Rajasthani Song';
  const shareText = `Ram Ram Sa! I am listening to "${fullTitle}" on Apno Dhun.\n\nApne favourite Rajasthani geet yahan suno!\nhttps://apnodhun.in`;

  // Pure Native High-Resolution 2D Canvas Engine (1037 x 1516 Pixel-Perfect Ratio Engine)
  const generatePureNativeCanvasBlob = async () => {
    // Ensure Web Fonts (Playfair Display & Inter) are fully loaded
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {}
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1037;
    canvas.height = 1516;
    const ctx = canvas.getContext('2d');

    // High Precision Vector Smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. Load Full-Resolution Template Image (dhun-card-blank.png)
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = '/dhun-card-blank.png';
    await new Promise((resolve) => {
      bgImg.onload = resolve;
      bgImg.onerror = resolve;
    });

    if (bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, 1037, 1516);
    } else {
      ctx.fillStyle = '#6A0C10';
      ctx.fillRect(0, 0, 1037, 1516);
    }

    // 2. Load YouTube Video Thumbnail Image
    const thumbImg = new Image();
    thumbImg.crossOrigin = 'anonymous';
    thumbImg.src = thumbUrl;
    await new Promise((resolve) => {
      thumbImg.onload = resolve;
      thumbImg.onerror = resolve;
    });

    // Exact Proportional Dimensions matching Preview DOM (Scale Factor ~2.98x)
    const thumbW = 610;
    const thumbH = 343;
    const thumbX = (1037 - thumbW) / 2;
    const thumbY = 523; // top 34.5% of 1516 = 523px

    // Cover Crop Math (Exact same behavior as CSS background-size: cover)
    const imgW = thumbImg.naturalWidth || 480;
    const imgH = thumbImg.naturalHeight || 360;
    const imgAspect = imgW / imgH;
    const targetAspect = thumbW / thumbH;

    let sx = 0, sy = 0, sw = imgW, sh = imgH;
    if (imgAspect > targetAspect) {
      sw = imgH * targetAspect;
      sx = (imgW - sw) / 2;
    } else {
      sh = imgW / targetAspect;
      sy = (imgH - sh) / 2;
    }

    // Draw Rounded Clipped Thumbnail with Cover Crop Zoom
    ctx.save();
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(thumbX, thumbY, thumbW, thumbH, 48);
    } else {
      ctx.rect(thumbX, thumbY, thumbW, thumbH);
    }
    ctx.clip();

    if (thumbImg.complete && thumbImg.naturalWidth > 0) {
      ctx.drawImage(thumbImg, sx, sy, sw, sh, thumbX, thumbY, thumbW, thumbH);
    }
    ctx.restore();

    // Subtle Crimson Accent Outline Border
    ctx.save();
    ctx.strokeStyle = 'rgba(122, 14, 19, 0.25)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(thumbX, thumbY, thumbW, thumbH, 48);
    }
    ctx.stroke();
    ctx.restore();

    // 3. Render Vector Song Title (Proportionate 42px Thin Red Serif Font)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#7A0E13';
    ctx.font = '300 42px "Playfair Display", Georgia, serif';

    const maxTitleWidth = 910;
    const titleY = thumbY + thumbH + 28; // 894px
    const words = fullTitle.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTitleWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    let currentY = titleY;
    const lineHeight = 54;
    lines.slice(0, 3).forEach((l) => {
      ctx.fillText(l, 1037 / 2, currentY);
      currentY += lineHeight;
    });

    // 4. Render Vector Artist Name (Proportionate 32px Thin Muted Red Font)
    ctx.font = '300 32px "Inter", sans-serif';
    ctx.fillStyle = '#802025';
    ctx.fillText(currentTrack.artist || 'Apno Dhun', 1037 / 2, currentY + 4);
    ctx.restore();

    // Return uncompressed 100% quality PNG blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
    });
  };

  const handleSharePatrika = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      const blob = await generatePureNativeCanvasBlob();
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
        {/* Royal Patrika Card Modal with dhun-card-blank.png Background Template */}
        <div className="patrika-card-blank-bg" ref={cardRef}>
          {/* Centered Clean Content (Positioned in middle blank space) */}
          <div className="blank-clean-content-lower">
            {/* Background Image Container for clean screen preview */}
            <div
              className="clean-thumb-wrap-larger"
              style={{ backgroundImage: `url(${thumbUrl})` }}
            />

            <h3 className="clean-song-title-compact">{currentTrack.title}</h3>
            <p className="clean-artist-name-red">{currentTrack.artist}</p>
          </div>
        </div>

        {/* 2 Clean Full-Width Pill Buttons */}
        <div className="patrika-actions">
          <button className="patrika-pill-btn share-pill" onClick={handleSharePatrika} disabled={isSharing}>
            {isSharing ? 'Generating Ultra HD Card...' : 'Share your Patrika'}
          </button>
          <button className="patrika-pill-btn notnow-pill" onClick={onClose}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
