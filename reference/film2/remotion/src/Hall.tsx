import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {C} from './look';

// The horizon is this film's own narration: one vertical light per 0.1 s of RMS, mirrored on a dark floor.
// What has already been spoken is lit; what is still to come is dim. Nothing here is decorative.
type Props = {rms: number[]; spokenSec: number; squeeze?: number; dim?: number; camZ?: number; human?: number};

const Bars: React.FC<{rms: number[]; spokenSec: number; squeeze: number; dim: number}> = ({rms, spokenSec, squeeze, dim}) => {
  const W = 34 * squeeze;
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
  const lit = Math.floor(spokenSec * 10);
  return (
    <group>
      {rms.map((v, i) => {
        const x = -W / 2 + (W * i) / rms.length;
        const h = 0.06 + v * 3.4;
        const on = i <= lit;
        const color = on ? C.data : '#2a6470';
        const op = (on ? 1 : 0.4) * (1 - dim * 0.88);
        return (
          <group key={i} position={[x, 0, 0]}>
            <mesh geometry={geo} position={[0, h / 2, 0]} scale={[(W / rms.length) * 0.6, h, 1]}>
              <meshBasicMaterial color={color} transparent opacity={op} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh geometry={geo} position={[0, -h / 2, 0]} scale={[(W / rms.length) * 0.55, h, 1]}>
              <meshBasicMaterial color={color} transparent opacity={op * 0.32} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const Hall: React.FC<Props> = ({rms, spokenSec, squeeze = 1, dim = 0, camZ = 16, human = 0}) => {
  const {width, height} = useVideoConfig();
  return (
    <div style={{position: 'absolute', inset: 0, filter: `drop-shadow(0 0 5px ${C.data}aa) drop-shadow(0 0 26px ${C.data}55)`}}>
    <ThreeCanvas width={width} height={height} style={{position: 'absolute', inset: 0}}
      camera={{position: [0, 1.5, camZ], rotation: [0.075, 0, 0], fov: 38, near: 0.1, far: 200}}>
      <fog attach="fog" args={['#06121a', 14, 52]} />
      <group position={[0, 0, -6]}>
        <Bars rms={rms} spokenSec={spokenSec} squeeze={squeeze} dim={dim} />
      </group>
      {human > 0 && (
        <mesh position={[0, 0.9, 4]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshBasicMaterial color={C.human} transparent opacity={human} />
        </mesh>
      )}
    </ThreeCanvas>
    </div>
  );
};
