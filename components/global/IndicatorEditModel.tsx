import { useEffect, useState } from "react";
import { SingleSelect } from "../single-select";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount from "@/lib/IndicatorProvincesTargetCalculator";



interface EditIndicatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (indicator: Indicator) => void;
    indicatorData?: Indicator | null;
    indicators: Indicator[];
}

const defaultIndicatorState = (): Indicator => ({
    id: null,
    outputId: null,
    outputRef: "",
    indicator: "",
    indicatorRef: "",
    target: 0,
    status: "active",
    provinces: [],
    dessaggregationType: "indevidual",
    description: "",
    database: "",
    type: null,
    subIndicator: null,
});

export const EditIndicatorModal: React.FC<EditIndicatorModalProps> = ({
    isOpen,
    onClose,
    onSave,
    indicatorData,
    indicators,
}) => {
    const [local, setLocal] = useState<Indicator>(defaultIndicatorState());

    useEffect(() => {
    if (indicatorData) {
        setLocal({
        ...defaultIndicatorState(),
        ...indicatorData,
        });
    } else {
        setLocal(defaultIndicatorState());
    }
    }, [indicatorData, isOpen]);

    const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name == "subIndicatorName" && local.subIndicator) {

        setLocal((prev) => ({
            ...prev,
            subIndicator: {
                ...prev.subIndicator!,
                name: value,
            }
        }))

        return;

    }else if (name == "subIndicatorTarget" && local.subIndicator) {

        setLocal((prev) => ({
            ...prev,
            subIndicator: {
                ...prev.subIndicator!,
                target: Number(value),
            }
        }))

        return
    }

    setLocal((prev) => ({
        ...prev,
        [name]:
        name === "target"
            ? Number(value)
            : name === "type"
            ? value || null
            : value,
    }));
    };

    const handleSave = () => {
    if (!local.indicator.trim() || !local.indicatorRef.trim()) {
        // minimal validation - you can replace with toast from parent
        alert("Indicator name and reference are required.");
        return;
    }
    onSave(local);
    onClose();
    };

    useEffect(() => {
    console.log("local changed", local);
    }, [local]);

    const hundleIndicatorFormChange = (e: any) => {
    const { province, name, value } = e.target;
    if (!local.subIndicator) return;

    const updatedProvinces = local.subIndicator.provinces.map((p: any) =>
        p.province === province.province
        ? {
            ...p,
            councilorCount:
            name === "subIndicatorProvinceCouncilorCount" ? Number(value) : p.councilorCount,
            target:
            name === "subIndicatorProvinceTarget" ? Number(value) : p.target,
        }
        : p
    );

    setLocal((prev) => ({
        ...prev,
        subIndicator: {
        ...prev.subIndicator,
        provinces: updatedProvinces,
        } as any,
    }));
    };

    return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-y-auto"
        style={{
          maxHeight: "85vh",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
        >
        <DialogHeader>
            <DialogTitle>Edit Indicator</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
            <div className="flex flex-col gap-1">
            <Label htmlFor="indicator">Indicator</Label>
            <Input
                id="indicator"
                name="indicator"
                value={local.indicator || ""}
                onChange={handleChange}
                placeholder="Indicator name"
            />
            </div>

            <div className="flex flex-col gap-1">
            <Label htmlFor="indicatorRef">Indicator Reference</Label>
            <Input
                id="indicatorRef"
                name="indicatorRef"
                value={local.indicatorRef || ""}
                onChange={handleChange}
                placeholder="Indicator reference"
            />
            </div>

            <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
                <Label htmlFor="target">Target</Label>
                <Input
                id="target"
                name="target"
                type="number"
                value={local.target ?? 0}
                onChange={handleChange}
                placeholder="Target"
                />
            </div>

            <div className="flex-1 flex flex-col gap-1">
                <Label htmlFor="status">Status</Label>
                <SingleSelect
                value={local.status}
                onValueChange={(v: string) =>
                    setLocal((prev) => ({ ...prev, status: v }))
                }
                options={[
                    { value: "active", label: "Active" },
                    { value: "notStarted", label: "Not Started" },
                    { value: "inProgress", label: "In Progress" },
                    { value: "achived", label: "Achived" },
                    { value: "notAchived", label: "Not Achived" },
                ]}
                placeholder="Select status"
                />
            </div>
            </div>

            <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
                <Label>Database</Label>
                <SingleSelect
                options={[
                    {
                    value: "main_database",
                    label: "Main Database",
                    },
                    {
                    value: "main_database_meal_tool",
                    label: "Main Database (Target: Meal Tool)",
                    },
                    {
                    value: "kit_database",
                    label: "Kit Database",
                    },
                    {
                    value: "psychoeducation_database",
                    label: "Psychoeducation Database",
                    },
                    {
                    value: "cd_database",
                    label: "Community Dialog Database",
                    },
                    {
                    value: "training_database",
                    label: "Training Database",
                    },
                    {
                    value: "referral_database",
                    label: "Referral Database",
                    },
                ].filter((opt) => {
                    if (opt.value == "main_database") {
                    if (indicators.find((indicator) => indicator.database == "main_database" && indicator.type == "adult_psychosocial_support") 
                        && indicators.find((indicator) => indicator.database == "main_database" && indicator.type == "child_psychosocial_support")
                    && indicators.find((indicator) => indicator.database == "main_database" && indicator.type == "parenting_skills")
                    && indicators.find((indicator) => indicator.database == "main_database" && indicator.type == "child_care_practices"))
                        return false;
                    }
                    return true;
                })}
                value={local.database}
                onValueChange={(value: string) =>
                    setLocal((prev) => ({
                    ...prev,
                    database: value,
                    }))
                }
                />

                {/* Type if the database is main database (backend helper) */}
                {(local.database == "main_database") && (
                <div className="flex flex-col gap-1 col-span-full">
                    <Label>Type</Label>
                    <SingleSelect
                    options={[
                        {
                        value: "adult_psychosocial_support",
                        label: "Adult Psychosocial Support",
                        },
                        {
                        value: "child_psychosocial_support",
                        label: "Child Psychosocial Support",
                        },
                        {
                        value: "parenting_skills",
                        label: "Parenting Skills",
                        },
                        {
                        value: "child_care_practices",
                        label: "Child Care Practices",
                        },
                    ].filter((opt) => !indicators.find((indicator) => (indicator.database == "main_database" && indicator.type == opt.value 
                        && indicator.id !== local.id
                    )))}
                    value={local.type as unknown as string}
                    onValueChange={(value: string) =>
                        setLocal((prev) => ({
                        ...prev,
                        type: value,
                        }))
                    }
                    />
                </div>
                )}
            </div>
            </div>

            {local.provinces && (
                <div className="flex flex-col gap-4 mt-4">
                    <Separator className="my-2" />
                    {local.provinces.map((province, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                    >
                        <div>
                        <span>{province.province}</span>
                        </div>
                        <div className="flex flex-col gap-1">
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

                            setLocal((prev) => {
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
                                ,setLocal
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
                        <div className="flex flex-col gap-1">
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
                            setLocal((prev) => ({
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
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={local.description || ""}
                    onChange={handleChange}
                    placeholder="Optional description"
                />
            </div>

            {/* sub indicator if its not null and */}
            {local.subIndicator && (
                <div className="flex flex-col gap-2">
                    <Label>Sub Indicator</Label>
                    <div className="flex flex-col gap-2">
                        <Input
                            name="subIndicatorName"
                            value={local.subIndicator.name}
                            onChange={handleChange}
                            placeholder="Sub Indicator Name"
                        />
                        <Input
                            name="subIndicatorTarget"
                            type="number"
                            value={local.subIndicator.target}
                            onChange={handleChange}
                            placeholder="Sub Indicator Target"
                        />
                        {/* sub indicator provinces and its target */}
                        {local.subIndicator?.provinces.map((province, index) => (
                        <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                        >
                        <div>
                            <span>{province.province}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label
                            htmlFor={`${province.province}-count`}
                            >
                            Councular Count
                            </Label>
                            <Input
                            id={`${province.province}-count`}
                            type="number"
                            name="subIndicatorProvinceCouncilorCount"
                            value={province.councilorCount || 0}
                            onChange={(e) => {
                                hundleIndicatorFormChange({
                                target: {
                                    province: province,
                                    name: e.target.name,
                                    value: e.target.value,
                                },
                                });
                            }}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label
                            htmlFor={`${province.province}-target`}
                            >
                            Target
                            </Label>
                            <Input
                            id={`${province.province}-target`}
                            type="number"
                            name="subIndicatorProvinceTarget"
                            value={province.target || 0}
                            onChange={(e) => {
                                hundleIndicatorFormChange({
                                target: {
                                    province: province,
                                    name: e.target.name,
                                    value: e.target.value,
                                },
                                });
                            }}
                            />
                        </div>
                        </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <DialogFooter>
            <div className="flex gap-2 justify-end w-full">
            <Button variant="outline" onClick={onClose}>
                Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
            </div>
        </DialogFooter>
        </DialogContent>
    </Dialog>
    );
};

export default EditIndicatorModal;


