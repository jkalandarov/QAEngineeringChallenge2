import {calculatePartHealth, calculateMachineHealth} from '../calculations';
import {
  AssemblyLinePart,
  MachineType,
  WeldingRobotPart,
  partInfo,
  PaintingStationPart,
  QualityControlStationPart
} from '../../native-app/data/types';

describe('calculatePartHealth', () => {
  it('calculates part health correctly', () => {
    const machineName: MachineType = MachineType.WeldingRobot;
    const part: partInfo = {name: WeldingRobotPart.ErrorRate, value: 0.5};
    const expectedHealth = 72.22222222222223;

    const result = calculatePartHealth(machineName, part);
    expect(result).toBe(expectedHealth);
  });

  it('validates machine name', () => {
    const part: partInfo = {name: WeldingRobotPart.ErrorRate, value: 0.5}; 
    const result = calculatePartHealth('machineName' as MachineType, part);
    expect(result).toBe(0);
  });

  it('validates part name', () => {
    const machineName: MachineType = MachineType.WeldingRobot;
    const part = { name: '', value: 0.5 } as unknown as partInfo;
    const result = calculatePartHealth(machineName, part);
    expect(result).toBe(-1);
  });

  it('calculates correctly when value is within normal range', () => {
    const machineName: MachineType = MachineType.AssemblyLine;
    const part: partInfo = {name: AssemblyLinePart.BeltSpeed, value: 1.65};
    const expectedHealth = 82.5;

    const result = calculatePartHealth(machineName, part);
    expect(result).toBe(expectedHealth);
  });

  it('calculates correctly when value is out of abnormal range', () => {
    const machineName: MachineType = MachineType.PaintingStation;
    const part: partInfo = {name: PaintingStationPart.FlowRate, value: 40.01};

    const result = calculatePartHealth(machineName, part);
    expect(result).toBe(0);
  });

  it('calculates correctly when value is within optimal range', () => {
    const machineName: MachineType = MachineType.QualityControlStation;
    const part: partInfo = {name: QualityControlStationPart.CameraCalibration, value: 0};
    const expectedHealth = 100;

    const result = calculatePartHealth(machineName, part);
    expect(result).toBe(expectedHealth); //Fails due to incorrect conditions in QualityControlStationPart.CameraCalibration
  });
});

describe('calculateMachineHealth', () => {
  it('calculates machine health correctly', () => {
    const machineName: MachineType = MachineType.WeldingRobot;
    const parts = [
      {name: WeldingRobotPart.ErrorRate, value: 0.5},
      {name: WeldingRobotPart.VibrationLevel, value: 4.0},
      {name: WeldingRobotPart.ElectrodeWear, value: 0.8},
      {name: WeldingRobotPart.ShieldingPressure, value: 12.0},
      {name: WeldingRobotPart.WireFeedRate, value: 7.5},
      {name: WeldingRobotPart.ArcStability, value: 92.0},
      {name: WeldingRobotPart.SeamWidth, value: 1.5},
      {name: WeldingRobotPart.CoolingEfficiency, value: 85.0},
    ];
    const expectedHealth = 76.70138888888889;

    const result = calculateMachineHealth(machineName, parts);
    expect(result).toBe(expectedHealth);
  });

  it('returns zero when incorrect machine name is passed', () => {
    const machineName = 'Incorrect machine name' as MachineType;
    const parts = [
      {name: AssemblyLinePart.AlignmentAccuracy, value: 0.2},
      {name: AssemblyLinePart.BeltSpeed, value: 2.5},
      {name: AssemblyLinePart.FittingTolerance, value: 0.01},
      {name: AssemblyLinePart.Speed, value: -1},
    ];
    const expectedHealth = 0;

    const result = calculateMachineHealth(machineName, parts);
    expect(result).toBe(expectedHealth);
  });

  it('returns zero when correct machine name with incorrect part names is passed', () => {
    const machineName: MachineType = MachineType.AssemblyLine;
    const parts = [
      {name: 'No machinery' as AssemblyLinePart, value: -1},
      {name: 'No machinery' as AssemblyLinePart, value: 1.2},
      {name: 'No machinery' as AssemblyLinePart, value: 0.099},
      {name: 'No machinery' as AssemblyLinePart, value: 4},
    ];
    const expectedHealth = 0;

    const result = calculateMachineHealth(machineName, parts);
    expect(result).toBe(expectedHealth);
  });

  it('calculates correctly when values are out of range', () => {
    const machineName: MachineType = MachineType.AssemblyLine;
    const parts = [
      {name: AssemblyLinePart.AlignmentAccuracy, value: -1},
      {name: AssemblyLinePart.BeltSpeed, value: -1},
      {name: AssemblyLinePart.FittingTolerance, value: -1},
      {name: AssemblyLinePart.Speed, value: -1},
    ];
    const expectedHealth = 0;

    const result = calculateMachineHealth(machineName, parts);
    expect(result).toBe(expectedHealth);
  });
});
