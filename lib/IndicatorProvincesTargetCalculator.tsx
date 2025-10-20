const calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount =
    (indicator: Indicator, indicatorStataSetter: any) => {
      if (indicator == null || indicator.provinces.length == 0) return;

      const totalIndicatorTarget: number = indicator.target;
      const totalNumberOfIndicatorCouncilorCount: number =
        indicator.provinces.reduce(
          (acc, current) => acc + Number(current.councilorCount || 0),
          0
        );

      const provinceWithMostNumberOfCouncilorCount: string =
        indicator.provinces.reduce((maxObj, item) =>
          item.councilorCount > maxObj.councilorCount ? item : maxObj
        ).province;

      const baseTargetForEachCouncilor: number =
        totalIndicatorTarget / totalNumberOfIndicatorCouncilorCount;

      const needForSomeManipulation: boolean =
        totalIndicatorTarget % totalNumberOfIndicatorCouncilorCount == 0
          ? false
          : true;

      if (needForSomeManipulation) {
        const manipulatedBaseTargetForEachCouncilor = Math.floor(
          baseTargetForEachCouncilor
        );

        const eachCouncilorTargetExceptTheProvinceWhichHasTheMostCouncilorCount: number =
          manipulatedBaseTargetForEachCouncilor;

        const councilorTargetOfProvinceWithMostNumberOfCouncilorCount: number =
          totalIndicatorTarget -
          (totalNumberOfIndicatorCouncilorCount - 1) *
            eachCouncilorTargetExceptTheProvinceWhichHasTheMostCouncilorCount;

        indicatorStataSetter((prev: any) => ({
          ...prev,
          provinces: prev.provinces.map((province: any) => ({
            ...province,
            target:
              province.province == provinceWithMostNumberOfCouncilorCount
                ? (province.councilorCount - 1) *
                    eachCouncilorTargetExceptTheProvinceWhichHasTheMostCouncilorCount +
                  councilorTargetOfProvinceWithMostNumberOfCouncilorCount
                : province.councilorCount *
                  eachCouncilorTargetExceptTheProvinceWhichHasTheMostCouncilorCount,
          })),
        }));
      } else {
        indicatorStataSetter((prev: any) => ({
          ...prev,
          provinces: prev.provinces.map((province: any) => ({
            ...province,
            target: province.councilorCount * baseTargetForEachCouncilor,
          })),
        }));
      }
};


export default calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount;