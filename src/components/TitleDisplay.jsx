import './TitleDisplay.css';

export default function TitleDisplay({ titleImg, position }) {
  const posClass = `pos-${position || 'center'}`;

  return (
    <div className={`title-block ${posClass}`}>
      <img
        key={titleImg}
        src={titleImg}
        alt=""
        className="title-img title-in"
        draggable="false"
      />
    </div>
  );
}
