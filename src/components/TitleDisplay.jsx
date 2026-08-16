import './TitleDisplay.css';

export default function TitleDisplay({ titleImg, position }) {
  const posClass = `pos-${position || 'center'}`;

  return (
    <div
      className={`title-block ${posClass}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        key={titleImg}
        src={titleImg}
        alt=""
        className="title-img title-in"
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
