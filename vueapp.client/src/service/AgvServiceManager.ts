
import AGVService from './AgvService';
import AGV from '@/models/agv';

const agvIds = ['001', '002', '003', '004', '005', '3002'];
const agvServices: Record<string, AGVService> = {};

export const initializeServices = () => {
  agvIds.forEach((id) => {
    // [TODO]: AGV 클래스 삭제 예정
    const agv = new AGV(id);
    const service = new AGVService(agv);
    agvServices[id] = service;
    service.connect();
  });
};

export const getAgvServiceList = () => agvServices;

export const getAgvService = (id: string) => {
  const service = agvServices[id];
  return service;
};

export default {
  initializeServices,
  getAgvServiceList,
  getAgvService,
};
