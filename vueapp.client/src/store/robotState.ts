import { defineStore } from 'pinia';
import { reactive } from 'vue';
import RobotState from '@/models/robotState';

export const useRobotStateStore = defineStore('agv', {
  state: () => ({
    robotStates: [] as RobotState[],
  }),

  actions: {
    addRobotState(state: RobotState) {
      const robotState = new RobotState(state.id);
      robotState.connected = state.connected;
      robotState.X = state.X;
      robotState.Y = state.Y;
      robotState.H = state.H;
      this.robotStates.push(reactive(robotState));
    },

    updateRobotState(state: RobotState) {
      const index = this.robotStates.findIndex((exist: RobotState) => exist.id === state.id);
      if (index !== -1) {
        const robotState = this.robotStates[index];
        robotState.connected = state.connected;
        robotState.X = state.X;
        robotState.Y = state.Y;
        robotState.H = state.H;

        console.log(`updateRobotState! => ${robotState.X} ${robotState.Y} ${robotState.H}`);
      } else {
        this.addRobotState(state);
      }
    },

    removeRobotState(id: string) {
      const index = this.robotStates.findIndex((state: RobotState) => state.id === id);
      if (index !== -1) {
        this.robotStates.splice(index, 1);
      }
    },
  },
});
