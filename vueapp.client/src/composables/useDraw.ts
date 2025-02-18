import { watchEffect } from 'vue';
import * as THREE from 'three';
import { useRobotStateStore } from '@/store/robotState';

export function useDraw(scene: THREE.Scene) {
  const store = useRobotStateStore();
  const robots = new Map(); 

  watchEffect(() => {
    store.robotStates.forEach((robotState) => {
      const { id, X, Y, H } = robotState;

      if (!robots.has(id)) {
        // 추가
        const robot = new THREE.Mesh(
          new THREE.BoxGeometry(2000, 2000, 2000),
          new THREE.MeshLambertMaterial({ color: 0x0000ff })
        );
        robot.position.set(X, 0, -Y);
        robot.rotation.y = -H * (Math.PI / 180); // 회전

        scene.add(robot);
        robots.set(id, robot);
      } else {
        // 위치 갱신
        const robot = robots.get(id);
        robot.position.set(X, 0, -Y);
        robot.rotation.y = -H * (Math.PI / 180);
      }
    });

    // 없으면 제거
    robots.forEach((robot, id) => {
      if (!store.robotStates.some((r) => r.id === id)) {
        scene.remove(robot);
        robots.delete(id);
      }
    });
  });
}
