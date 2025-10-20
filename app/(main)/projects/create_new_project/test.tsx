
<TabsContent value="indicator" className="h-full">
<Card className="h-full flex flex-col">
  <CardHeader>
    <CardTitle>Add Indicator</CardTitle>
    <CardDescription>
      Define each Indicator with its properties.
    </CardDescription>
  </CardHeader>

  <CardContent className="flex flex-col gap-6 overflow-auto">
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={openAccordion}
      onValueChange={setOpenAccordion}
    >
      {outputs.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.output}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 max-h-[600px] overflow-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Indicator */}
              <div className="flex flex-col gap-1">
                <Label htmlFor={`indicator-${index}`}>
                  Indicator
                </Label>
                <Input
                  id={`indicator-${index}`}
                  name="indicator"
                  value={indicator.indicator}
                  onChange={hundleIndicatorFormChange}
                  placeholder="Enter indicator"
                />
              </div>

              {/* Indicator Reference */}
              <div className="flex flex-col gap-1">
                <Label htmlFor={`indicatorRef-${index}`}>
                  Indicator Reference
                </Label>
                <Input
                  id={`indicatorRef-${index}`}
                  name="indicatorRef"
                  value={indicator.indicatorRef}
                  onChange={hundleIndicatorFormChange}
                  placeholder="Enter indicator reference..."
                />
              </div>

              {/* Indicator Target */}
              <div className="flex flex-col gap-1">
                <Label htmlFor={`target-${index}`}>
                  Indicator Target
                </Label>
                <Input
                  id={`target-${index}`}
                  name="target"
                  value={indicator.target}
                  onChange={hundleIndicatorFormChange}
                  placeholder="Enter indicator target..."
                />
              </div>

              {/* Indicator Status */}
              <div className="flex flex-col gap-1">
                <Label htmlFor={`status-${index}`}>
                  Indicator Status
                </Label>
                <SingleSelect
                  options={[
                    { value: "notStarted", label: "Not Started" },
                    { value: "inProgress", label: "In Progress" },
                    { value: "achived", label: "Achived" },
                    { value: "notAchived", label: "Not Achived" },
                    {
                      value: "partiallyAchived",
                      label: "Partially Achived",
                    },
                  ]}
                  value={indicator.status}
                  onValueChange={(value: string) => {
                    setIndicator((prev) => ({
                      ...prev,
                      status: value,
                    }));
                  }}
                  placeholder="Indicator Status"
                />
              </div>

              {/* Indicator Province */}
              <div className="flex flex-col gap-1">
                <Label htmlFor={`province-${index}`}>
                  Indicator Provinces
                </Label>
                <MultiSelect
                  options={projectProvinces.map((province) => ({
                    label: province.toLowerCase(),
                    value:
                      province.charAt(0).toUpperCase() +
                      province.slice(1),
                  }))}
                  value={indicator.provinces.map((province) => {
                    return province.province;
                  })}
                  onValueChange={(value: string[]) =>
                    setIndicator((prev) => ({
                      ...prev,
                      provinces: value.map((v) => ({
                        province: v,
                        target: 0,
                        councilorCount: 0,
                      })),
                    }))
                  }
                />
                {/* Add Target and Councilor Count fields for each province */}
                {indicator.provinces && (
                  <div className="flex flex-col gap-4 w-full">
                    <Separator className="my-2" />
                    {indicator.provinces.map((province, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row gap-4 w-full items-center"
                      >
                        {/* Province Name */}
                        <div className="flex flex-row items-center w-full md:w-1/4">
                          <span>{province.province}</span>
                        </div>

                        {/* Councular Count */}
                        <div className="flex flex-col w-full md:w-1/4 gap-2">
                          <Label
                            htmlFor={`${province.province}-count`}
                          >
                            Councular Count
                          </Label>
                          <Input
                            id={`${province.province}-count`}
                            type="number"
                            value={province.councilorCount || 0}
                            onChange={(e) => {
                              const value = Number(
                                e.target.value
                              );

                              setIndicator((prev) => {
                                const updatedProvinces =
                                  prev.provinces.map((p) =>
                                    p.province ===
                                    province.province
                                      ? {
                                          ...p,
                                          councilorCount: value,
                                        }
                                      : p
                                  );

                                calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount(
                                  {
                                    ...prev,
                                    provinces: updatedProvinces,
                                  }
                                );

                                return {
                                  ...prev,
                                  provinces: updatedProvinces,
                                };
                              });
                            }}
                            placeholder={`${
                              province.province
                                .charAt(0)
                                .toUpperCase() +
                              province.province
                                .slice(1)
                                .toLowerCase()
                            } Councular Count ...`}
                          />
                        </div>

                        {/* Target */}
                        <div className="flex flex-col w-full md:w-1/4 gap-2">
                          <Label
                            htmlFor={`${province.province}-target`}
                          >
                            Target
                          </Label>
                          <Input
                            id={`${province.province}-target`}
                            type="number"
                            value={province.target || 0}
                            onChange={(e) => {
                              const value = Number(
                                e.target.value
                              );
                              setIndicator((prev) => ({
                                ...prev,
                                provinces: prev.provinces.map(
                                  (p) =>
                                    p.province ===
                                    province.province
                                      ? { ...p, target: value }
                                      : p
                                ),
                              }));
                            }}
                            placeholder={`${
                              province.province
                                .charAt(0)
                                .toUpperCase() +
                              province.province
                                .slice(1)
                                .toLowerCase()
                            } Target ...`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dessaggregation Type */}
              <div className="flex flex-col gap-1">
                <Label htmlFor={`dessaggregationType-${index}`}>
                  Dessagreggation Type
                </Label>
                <RadioGroup
                  name="dessaggregationType"
                  value={indicator.dessaggregationType}
                  onValueChange={(value: string) => {
                    const e = {
                      target: {
                        name: "dessaggregationType",
                        value: value,
                      },
                    };

                    hundleIndicatorFormChange(e);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value="session"
                      id={`r1-${index}`}
                    />
                    <Label htmlFor={`r1-${index}`}>Session</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value="indevidual"
                      id={`r2-${index}`}
                    />
                    <Label htmlFor={`r2-${index}`}>
                      Indevidual
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value="iniac"
                      id={`r2-${index}`}
                    />
                    <Label htmlFor={`r2-${index}`}>Iniac</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Indicator Description */}
              <div className="flex flex-col gap-1 col-span-full">
                <Label htmlFor={`description-${index}`}>
                  Description
                </Label>
                <Textarea
                  id={`description-${index}`}
                  name="description"
                  value={indicator.description}
                  onChange={hundleIndicatorFormChange}
                  placeholder="Enter description..."
                />
              </div>

              {/* Sub Indicator Details if requisted */}
              <div
                className={`flex flex-col gap-2 w-full ${
                  reqForSubIndicator ? "block" : "hidden"
                }`}
              >
                <div className="flex flx-row justify-start items-center">
                  <span>Sub Indicator Details</span>
                </div>
                {/* content */}
                <div className="flex flex-row items-center justify-around">
                  {/* Indicator Target */}
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`target-${index}`}>
                      Sub Indicator Name
                    </Label>
                    <Input
                      id={`target-${index}`}
                      name="subIndicatorName"
                      value={indicator.subIndicator?.name}
                      onChange={hundleIndicatorFormChange}
                      placeholder="Enter sub indicator name..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor={`sub-indicator-target-${index}`}
                    >
                      Sub Indicator Target
                    </Label>
                    <Input
                      id={`sub-indicator-target-${index}`}
                      name="subIndicatorTarget"
                      value={indicator.subIndicator?.target}
                      onChange={hundleIndicatorFormChange}
                      placeholder="Enter sub indicator target..."
                    />
                  </div>
                  {/* Add Target and Councilor Count fields for each province */}
                  {indicator.provinces && (
                    <div className="flex flex-col gap-4 w-full">
                      <Separator className="my-2" />
                      {indicator.provinces.map(
                        (province, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col md:flex-row gap-4 w-full items-center"
                          >
                            {/* Province Name */}
                            <div className="flex flex-row items-center w-full md:w-1/4">
                              <span>{province.province}</span>
                            </div>

                            {/* Councular Count */}
                            <div className="flex flex-col w-full md:w-1/4 gap-2">
                              <Label
                                htmlFor={`${province.province}-count`}
                              >
                                Councular Count
                              </Label>
                              <Input
                                id={`${province.province}-count`}
                                type="number"
                                value={
                                  province.councilorCount || 0
                                }
                                onChange={(e) => {
                                  const value = Number(
                                    e.target.value
                                  );

                                  setIndicator((prev) => {
                                    const updatedProvinces =
                                      prev.provinces.map((p) =>
                                        p.province ===
                                        province.province
                                          ? {
                                              ...p,
                                              councilorCount:
                                                value,
                                            }
                                          : p
                                      );

                                    calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount(
                                      {
                                        ...prev,
                                        provinces:
                                          updatedProvinces,
                                      }
                                    );

                                    return {
                                      ...prev,
                                      provinces: updatedProvinces,
                                    };
                                  });
                                }}
                                placeholder={`${
                                  province.province
                                    .charAt(0)
                                    .toUpperCase() +
                                  province.province
                                    .slice(1)
                                    .toLowerCase()
                                } Councular Count ...`}
                              />
                            </div>

                            {/* Target */}
                            <div className="flex flex-col w-full md:w-1/4 gap-2">
                              <Label
                                htmlFor={`${province.province}-target`}
                              >
                                Target
                              </Label>
                              <Input
                                id={`${province.province}-target`}
                                type="number"
                                value={province.target || 0}
                                onChange={(e) => {
                                  const value = Number(
                                    e.target.value
                                  );
                                  setIndicator((prev) => ({
                                    ...prev,
                                    provinces: prev.provinces.map(
                                      (p) =>
                                        p.province ===
                                        province.province
                                          ? {
                                              ...p,
                                              target: value,
                                            }
                                          : p
                                    ),
                                  }));
                                }}
                                placeholder={`${
                                  province.province
                                    .charAt(0)
                                    .toUpperCase() +
                                  province.province
                                    .slice(1)
                                    .toLowerCase()
                                } Target ...`}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add Indicator Button and Add Sub Indicator Button */}
            <div className="flex flex-row justify-end mt-2 gap-2">
              <Button
                type="button"
                className="flex items-center gap-2"
                onClick={() => {
                  if (!indicator.dessaggregationType) {
                    reqForToastAndSetMessage(
                      "Main indicator dessaggregation type is empty !"
                    );
                    return;
                  }

                  if (!reqForSubIndicator) {
                    setIndicator((prev) => ({
                      ...prev,
                      subIndicator: {
                        indicatorRef: `sub-${prev.indicatorRef}`,
                        name: "",
                        target: 0,
                        dessaggregationType:
                          indicator.dessaggregationType ==
                          "session"
                            ? "indevidual"
                            : "session",
                        provinces: indicator.provinces.map(
                          (province) => ({
                            province: province.province,
                            target: 0,
                            councilorCount: 0,
                          })
                        ),
                      },
                    }));

                    setReqForSubIndicator(true);
                  } else {
                    setIndicator((prev) => ({
                      ...prev,
                      subIndicator: null,
                    }));

                    setReqForSubIndicator(false);
                  }
                }}
                disabled={
                  indicator.dessaggregationType == "iniac"
                }
              >
                <Plus size={16} />
                {reqForSubIndicator
                  ? "Remove Sub Indicator"
                  : "Add Sub Indicator"}
              </Button>
              <Button
                type="button"
                onClick={() =>
                  addIndicatorToIndicatorsState(item.outputRef)
                }
                className="flex items-center gap-2"
              >
                <Plus size={16} /> Add Indicator
              </Button>
            </div>

            {/* Added indicators */}
            <div className="mt-4 max-h-[240px] overflow-auto border rounded-xl">
              {indicators
                .filter((ind) => ind.outputRef === item.outputRef)
                .map((indItem, indIndex) => (
                  <div
                    key={indIndex}
                    className="flex items-center justify-between px-3 py-2 border-b last:border-b-0"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {indItem.indicator}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {indItem.indicatorRef}
                      </span>
                    </div>
                    <Trash
                      onClick={() =>
                        setIndicators((prev) =>
                          prev.filter((_, i) => i !== indIndex)
                        )
                      }
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      size={18}
                    />
                  </div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </CardContent>

  <CardFooter className="flex justify-end gap-2">
    <Button>Save Outputs</Button>
  </CardFooter>
</Card>
</TabsContent>