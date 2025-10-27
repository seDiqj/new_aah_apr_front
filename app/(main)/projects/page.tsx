"use client";

import BreadcrumbWithCustomSeparator from "@/components/global/BreadCrumb";
import DataTableDemo from "@/components/global/MulitSelectTable";
import SubHeader from "@/components/global/SubHeader";
import { Button } from "@/components/ui/button";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import {
  projectColumns,
} from "@/definitions/DataTableColumnsDefinitions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { withPermission } from "@/lib/withPermission";
import { Can } from "@/components/Can";

const ProjectsPage = () => {
  const router = useRouter();
  let [idFeildForEditStateSetter, setIdFeildForEditStateSetter] = useState<
    number | null
  >(null);

  let [idFeildForShowStateSetter, setIdFeildForShowStateSetter] = useState<
    number | null
  >(null);

  const openProjectProfile = (value: boolean, id: number) => {
    router.push(`projects/project_show/${id}`);
  };

  useEffect(() => {
    if (idFeildForShowStateSetter)
      openProjectProfile(true, idFeildForShowStateSetter);
  }, [idFeildForShowStateSetter]);

  return (
    <>
      <div className="w-full h-full p-2">
        <Navbar14 />
        <div className="flex flex-row items-center justify-start my-2">
          <BreadcrumbWithCustomSeparator></BreadcrumbWithCustomSeparator>
        </div>
        <SubHeader pageTitle={"Projects"}>
          <Can permission="Project.create">
            <Button
              onClick={() => {
                router.push("/projects/create_new_project");
              }}
            >
              Create New Project
            </Button>
          </Can>
        </SubHeader>
        <DataTableDemo
          columns={projectColumns}
          indexUrl="projects"
          filterUrl="/filter/projects"
          deleteUrl="projects/delete_projects"
          searchableColumn="projectTitle"
          deleteBtnPermission="Project.delete"
          editBtnPermission="Project.edit"
          idFeildForEditStateSetter={setIdFeildForEditStateSetter}
          editModelOpenerStateSetter={() => router.push(`/projects/edit_project/${idFeildForEditStateSetter}`)}
          idFeildForShowStateSetter={setIdFeildForShowStateSetter}
          filtersList={["projectCode", "projectManager", "provinces", "thematicSector", "startDate", "endDate", "status"]}
        ></DataTableDemo>
      </div>
    </>
  );
};

export default withPermission(ProjectsPage, "Project.view");
