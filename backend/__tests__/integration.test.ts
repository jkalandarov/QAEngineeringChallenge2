import request from 'supertest';
import app from '../app'
import { AssemblyLinePart, MachineType, partInfo, WeldingRobotPart } from '../../native-app/data/types';
import { response } from 'express';

describe('Integration tests', () => {
  it('validates incorrect input', async () => {
    await request(app)
    .post('/machine-health')
    .send({})
    .expect(400)
    .then(response => {
      expect(response.body.error).toBe('Invalid input format');
    });
  });

  it('calculates machine health correctly for single part', async () => {
    const requestBody = {
      machines: {
        [MachineType.WeldingRobot]: {
          [WeldingRobotPart.ErrorRate]: 0.5
        }
      }
    };
    
    await request(app)
      .post('/machine-health')
      .send(requestBody)
      .expect(200)
      .then(({body}) => {
        expect(body.factory).toBe('72.22');
        expect(body.machineScores.weldingRobot).toBe('72.22');
      });
  });

  it('calculates machine health correctly for multiple parts', async () => {
    const requestBody = {
      machines: {
        [MachineType.WeldingRobot]: {
          [WeldingRobotPart.ErrorRate]: 0.5,
          [WeldingRobotPart.VibrationLevel]: 4.0,
          [WeldingRobotPart.ElectrodeWear]: 0.8
        }
      }
    };

    await request(app)
      .post('/machine-health')
      .send(requestBody)
      .expect(200)
      .then(({body}) => {
        expect(body.factory).toBe('82.87');
        expect(body.machineScores.weldingRobot).toBe('82.87');
      });
  });

  it('does not calculate unknown part', async () => {
    const requestBody = {
      machines: {
        [MachineType.WeldingRobot]: {
          [WeldingRobotPart.ErrorRate]: 0.5,
          [WeldingRobotPart.VibrationLevel]: 4.0,
          [WeldingRobotPart.ElectrodeWear]: 0.8,
          'unknownPart': 1000
        }
      }
    };

    await request(app)
      .post('/machine-health')
      .send(requestBody)
      .expect(200)
      .then(({body}) => {
        expect(body.factory).toBe('82.87');
        expect(body.machineScores.weldingRobot).toBe('82.87');
      });
  });

  it('calculates machine health correctly for several machines', async () => {
    const requestBody = {
      machines: {
        [MachineType.WeldingRobot]: {
          [WeldingRobotPart.ErrorRate]: 0.5,
          [WeldingRobotPart.VibrationLevel]: 4.0,
          [WeldingRobotPart.ElectrodeWear]: 0.8
        },
        [MachineType.AssemblyLine]: {
          [AssemblyLinePart.AlignmentAccuracy]: 0.5,
          [AssemblyLinePart.BeltSpeed]: 1.3
        }
      }
    };

    await request(app)
      .post('/machine-health')
      .send(requestBody)
      .expect(200)
      .then(({body}) => {
        expect(body.factory).toBe('75.74');
        expect(body.machineScores.assemblyLine).toBe('68.61');
        expect(body.machineScores.weldingRobot).toBe('82.87');
      });
  });

  it('Unknown machine decreases machine health point', async () => {
    const requestBody = {
      machines: {
        [MachineType.WeldingRobot]: {
          [WeldingRobotPart.ErrorRate]: 0.5,
          [WeldingRobotPart.VibrationLevel]: 4.0,
          [WeldingRobotPart.ElectrodeWear]: 0.8
        },
        [MachineType.AssemblyLine]: {
          [AssemblyLinePart.AlignmentAccuracy]: 0.5,
          [AssemblyLinePart.BeltSpeed]: 1.3
        },
        'unknownMachine': {
          somePart: 999
        }
      }
    };

    await request(app)
      .post('/machine-health')
      .send(requestBody)
      .expect(200)
      .then(({body}) => {
        expect(body.factory).toBe('50.49');
        expect(body.machineScores.assemblyLine).toBe('68.61');
        expect(body.machineScores.weldingRobot).toBe('82.87');
        expect(body.machineScores.unknownMachine).toBe('0.00');
      });
  });
});