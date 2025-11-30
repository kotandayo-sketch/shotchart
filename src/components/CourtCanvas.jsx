import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line, Circle, Group } from 'react-konva';
import { AREAS } from '../lib/areas';
import { findAreaForPoint } from '../lib/util';
import useImage from 'use-image';
import { v4 as uuidv4 } from 'uuid';

export default function CourtCanvas({ shots = [], onAddShot, onSelectShot }) {
  const stageRef = useRef();

  // ===== ★ ここが重要：GitHub Pages でも絶対に動く画像パス =====
  const imgUrl = import.meta.env.BASE_URL + 'images/half-court.png';
  const [courtImg] = useImage(imgUrl);

  const [imgSize, setImgSize] = useState({ w: 900, h: 450 });
  const [pressStart, setPressStart] = useState(null);
  const [debugPos, setDebugPos] = useState(null);

  // 画像サイズを反映
  useEffect(() => {
    if (courtImg) {
      setImgSize({ w: courtImg.width, h: courtImg.height });
    }
  }, [courtImg]);

  const handlePointerDown = () => {
    setPressStart({ time: Date.now() });
  };

  const handlePointerUp = () => {
    const pos = stageRef.current.getPointerPosition();
    const nx = pos.x / imgSize.w;
    const ny = pos.y / imgSize.h;

    // デバッグ表示
    setDebugPos({ x: nx, y: ny });

    // 長押し処理
    if (pressStart && Date.now() - pressStart.time > 600) {
      const found = shots.find(s => {
        const dx = s.x - nx;
        const dy = s.y - ny;
        return Math.hypot(dx, dy) < 0.02;
      });
      if (found) {
        onSelectShot(found);
        return;
      }
    }

    // 新規ショット
    const areaId = findAreaForPoint({ x: nx, y: ny }, AREAS);
    const result = window.confirm('成功ならOK（OK: 成功 / キャンセル: 失敗）')
      ? 'made'
      : 'miss';

    const shot = {
      id: uuidv4(),
      playerId: 'player-1',
      sessionId: 'session-1',
      t: new Date().toISOString(),
      x: nx,
      y: ny,
      areaId,
      result
    };

    onAddShot(shot);
  };

  return (
    <div style={{ width: '100%', maxWidth: imgSize.w, margin: '0 auto', position: 'relative' }}>
      <Stage
        width={imgSize.w}
        height={imgSize.h}
        ref={stageRef}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
      >
        <Layer>
          {/* 背景画像 */}
          {courtImg ? (
            <Group>
              <Line
                points={[0, 0, imgSize.w, 0, imgSize.w, imgSize.h, 0, imgSize.h]}
                closed
                fillPatternImage={courtImg}
                fillPatternScale={{
                  x: imgSize.w / courtImg.width,
                  y: imgSize.h / courtImg.height
                }}
                scaleY={-1}
                offsetY={imgSize.h}
              />

              <Line
                points={[0, 0, imgSize.w, 0, imgSize.w, imgSize.h, 0, imgSize.h]}
                closed
                stroke="#ddd"
              />
            </Group>
          ) : (
            <Line
              points={[0, 0, imgSize.w, 0, imgSize.w, imgSize.h, 0, imgSize.h]}
              closed
              fill="#fafafa"
              stroke="#ddd"
            />
          )}

          {/* エリアライン */}
          {AREAS.map(a => (
            <Line
              key={a.id}
              points={a.polygon.flatMap(([nx, ny]) => [nx * imgSize.w, ny * imgSize.h])}
              closed
              stroke="#00ff00"
              strokeWidth={2}
              opacity={0.9}
              listening={false}
            />
          ))}

          {/* ショット */}
          {shots.map(s => (
            <Circle
              key={s.id}
              x={s.x * imgSize.w}
              y={s.y * imgSize.h}
              radius={6}
              fill={s.result === 'made' ? '#0077ff' : '#ff3b30'}
              opacity={0.95}
            />
          ))}
        </Layer>
      </Stage>

      {/* デバッグ */}
      {debugPos && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 10
          }}
        >
          x: {debugPos.x.toFixed(3)} <br />
          y: {debugPos.y.toFixed(3)}
        </div>
      )}
    </div>
  );
}
