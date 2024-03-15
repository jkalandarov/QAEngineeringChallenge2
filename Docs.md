# Unit tests

```
./backend/__tests__/calculate.test.ts
```

I added a few test cases to both `calculatePartHealth` and `calculateMachineHealth` test suites.

`calculates correctly when value is within optimal range` test in `calculatePartHealth` suite fails due to incorrect conditions in `QualityControlStationPart.CameraCalibration`.

# Integration tests

Integration test are located in the same folder as unit tests but in `integration.test.ts`. The goal of integrations test to make sure the app components can communicate with each other and we can address to those components only through `/machine-health` API endpoint.

### How to run test

```shell
cd ./backend && npm run test --watchAll
```

No need to run backend service to run tests. `superagent` package runs backend service before running tests and stops after tests.
