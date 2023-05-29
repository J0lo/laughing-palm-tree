# Wedding Photography recruitment task
## Proposed solution
Normally it could be achieved with hard-coding the solution in the index.ts file, it would provide a more compact solution, easier to test and achievable in probably half the time (probably around a couple of hours).

However due to the requirement, that the code should provide easy ways to add new ServiceTypes or ServiceYears, I've decided that it would be beneficial to have a more generic algorythm, that takes service prices, packages and other necessary data from a configuration file (or a database, or a third party service etc.) that would define prices, price packages and any and all relationships between the packages. 

All of the logic was commented in the code, including any doubts or improvement ideas I might have had.

### Added code
- ./model/ folder - used to hold class definitions for all data that we are getting from the config file
- ./repository/dataRepository.ts - data repository layer
- ./data/data.json - file with all of the required service and service package definitions

### Added tests
It was necessary to add tests for a couple of the requirements, otherwise there would be no indication if they were met:
- calcularePrice.videoRecordingWithPhotographyWithTwoDayEvent
- calcularePrice.videoRecordingWithBlurayPackage

### Test results
```
 PASS  src/index.test.ts
  updateSelectedServices.select
    √ should select when not selected (2 ms)
    √ should not select the same service twice
    √ should not select related service when main service is not selected (1 ms)
    √ should select related service when main service is selected
    √ should select related service when one of main services is selected
  updateSelectedServices.deselect
    √ should deselect (1 ms)
    √ should do nothing when service not selected
    √ should deselect related when last main service deselected
    √ should not deselect related when at least one main service stays selected (1 ms)
  calculatePrice.zero (2020)
    √ should be zero with no services selected
  calculatePrice.zero (2021)
    √ should be zero with no services selected
  calculatePrice.zero (2022)
    √ should be zero with no services selected
  calculatePrice.singleService (WeddingSession, 2020)
    √ no discount applied (1 ms)
    √ price matches requirements
  calculatePrice.singleService (WeddingSession, 2021)
    √ no discount applied (1 ms)
    √ price matches requirements
  calculatePrice.singleService (WeddingSession, 2022)
    √ no discount applied
    √ price matches requirements
  calculatePrice.singleService (Photography, 2020)
    √ no discount applied (1 ms)
    √ price matches requirements
  calculatePrice.singleService (Photography, 2021)
    √ no discount applied (1 ms)
    √ price matches requirements
  calculatePrice.singleService (Photography, 2022)
    √ no discount applied
    √ price matches requirements
  calculatePrice.singleService (VideoRecording, 2020)
    √ no discount applied (1 ms)
    √ price matches requirements
  calculatePrice.singleService (VideoRecording, 2021)
    √ no discount applied
    √ price matches requirements
  calculatePrice.singleService (VideoRecording, 2022)
    √ no discount applied (1 ms)
    √ price matches requirements
  calcularePrice.photographyWithWeddingSessionPrice (2020 increase by 300)
    √ price matches requirements
    √ discount applied
  calcularePrice.photographyWithWeddingSessionPrice (2021 increase by 300)
    √ price matches requirements
    √ discount applied
  calcularePrice.photographyWithWeddingSessionPrice (2022 increase by 0)
    √ price matches requirements (1 ms)
    √ discount applied
  calcularePrice.videoRecordingWithWeddingSessionPrice (2020 increase by 300)
    √ price matches requirements
    √ discount applied
  calcularePrice.videoRecordingWithWeddingSessionPrice (2021 increase by 300)
    √ price matches requirements
    √ discount applied
  calcularePrice.videoRecordingWithWeddingSessionPrice (2022 increase by 300)
    √ price matches requirements (1 ms)
    √ discount applied
  calcularePrice.videoRecordingWithPhotographyPrice (2020 increase by 500)
    √ price matches requirements
    √ discount applied
  calcularePrice.videoRecordingWithPhotographyPrice (2021 increase by 500)
    √ price matches requirements
    √ discount applied
  calcularePrice.videoRecordingWithPhotographyPrice (2022 increase by 600)
    √ discount applied
  calcularePrice.videoRecordingWithPhotographyWithSessionPrice (2020 increase by 300)
    √ price matches requirements
    √ discount applied
  calcularePrice.videoRecordingWithPhotographyWithSessionPrice (2021 increase by 300)
    √ price matches requirements
    √ discount applied (1 ms)
  calcularePrice.videoRecordingWithPhotographyWithSessionPrice (2022 increase by 0)
    √ price matches requirements
    √ discount applied
  calcularePrice.videoRecordingWithPhotographyWithTwoDayEvent (2020 increase by 400)
    √ price matches requirements
  calcularePrice.videoRecordingWithPhotographyWithTwoDayEvent (2021 increase by 400)
    √ price matches requirements (1 ms)
  calcularePrice.videoRecordingWithPhotographyWithTwoDayEvent (2022 increase by 400)
    √ price matches requirements
  calcularePrice.videoRecordingWithBlurayPackage (2020 increase by 300)
    √ price matches requirements
  calcularePrice.videoRecordingWithBlurayPackage (2021 increase by 300)
    √ price matches requirements (1 ms)
  calcularePrice.videoRecordingWithBlurayPackage (2022 increase by 300)
    √ price matches requirements

Test Suites: 1 passed, 1 total
Tests:       60 passed, 60 total
Snapshots:   0 total
Time:        1.979 s, estimated 2 s
Ran all test suites.
```