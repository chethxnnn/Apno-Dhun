import { useRef, useState } from 'react';
import './PatrikaModal.css';

export default function PatrikaModal({
  isOpen,
  onClose,
  currentTrack,
  currentMode = 'wedding',
}) {
  const cardRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen || !currentTrack) return null;

  const modeLabels = {
    folk: 'लोक री धुन (Traditional Folk)',
    wedding: 'ब्याव रा गीत (Wedding Classics)',
    devotional: 'भगवान री भक्ति (Devotional)',
    trending: 'नवो ट्रेंड (Modern Hits)',
  };

  const handleSharePatrika = async () => {
    if (!cardRef.current || isSharing) return;
    setIsSharing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1080;
      canvas.height = 1920;

      // Draw background
      ctx.fillStyle = '#140c10';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gold border frame
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 12;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      ctx.strokeStyle = '#FFDF73';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

      // Header text
      ctx.fillStyle = '#FFDF73';
      ctx.font = 'bold 54px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('APNA CULTUREZ', canvas.width / 2, 200);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 72px sans-serif';
      ctx.fillText('शाही निमंत्रण पत्रिका', canvas.width / 2, 320);

      // Divider line
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.beginPath();
      ctx.moveTo(200, 380);
      ctx.lineTo(880, 380);
      ctx.stroke();

      // Vibe
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '36px sans-serif';
      ctx.fillText('महफ़िल (VIBE)', canvas.width / 2, 480);

      ctx.fillStyle = '#FFDF73';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText(modeLabels[currentMode] || currentMode, canvas.width / 2, 560);

      // Song Title
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '36px sans-serif';
      ctx.fillText('सुरु री धुन (NOW PLAYING)', canvas.width / 2, 720);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(currentTrack.title || 'Rajasthani Song', canvas.width / 2, 810);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '42px sans-serif';
      ctx.fillText(currentTrack.artist || 'Apna Culturez', canvas.width / 2, 880);

      // Details Box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.roundRect(150, 1020, 780, 240, 24);
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.stroke();

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('स्थान (LOCATION)             पाहुना (GUEST SEAT)', canvas.width / 2, 1100);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('Jaipur, Rajasthan           Royal Jharokha', canvas.width / 2, 1180);

      // Quote
      ctx.fillStyle = '#FFDF73';
      ctx.font = 'italic 44px sans-serif';
      ctx.fillText('"अपणा संगीत री महफ़िल में आपरो घणी खम्मा सा!"', canvas.width / 2, 1420);

      // Footer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '32px sans-serif';
      ctx.fillText('apno-dhun.vercel.app  •  @apna.culturez', canvas.width / 2, 1720);

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
              text: `शाही निमंत्रण — Apno Dhun (${currentTrack.title})`,
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
        {/* Vertical Card Preview */}
        <div className="patrika-card" ref={cardRef}>
          <div className="patrika-border-outer">
            <div className="patrika-border-inner">
              <div className="patrika-header">
                <span className="patrika-brand">APNA CULTUREZ</span>
                <h2 className="patrika-title">शाही निमंत्रण</h2>
                <span className="patrika-subtitle">राजस्थान री संगीत यात्रा</span>
              </div>

              <div className="patrika-divider" />

              <div className="patrika-body">
                <div className="patrika-section">
                  <span className="section-tag">महफ़िल (VIBE)</span>
                  <p className="section-value vibe-value">{modeLabels[currentMode]}</p>
                </div>

                <div className="patrika-section">
                  <span className="section-tag">सुरु री धुन (NOW PLAYING)</span>
                  <p className="section-value song-title">{currentTrack.title}</p>
                  <p className="section-subvalue">{currentTrack.artist}</p>
                </div>

                <div className="patrika-grid-box">
                  <div className="grid-cell">
                    <span className="cell-label">स्थान (LOCATION)</span>
                    <span className="cell-val">Jaipur, Rajasthan</span>
                  </div>
                  <div className="grid-cell">
                    <span className="cell-label">पाहुना (GUEST)</span>
                    <span className="cell-val">Royal Jharokha</span>
                  </div>
                </div>

                <p className="patrika-quote">"अपणा संगीत री महफ़िल में आपरो घणी खम्मा सा!"</p>
              </div>

              <div className="patrika-footer">
                <span>apno-dhun.vercel.app</span>
                <span>@apna.culturez</span>
              </div>
            </div>
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
