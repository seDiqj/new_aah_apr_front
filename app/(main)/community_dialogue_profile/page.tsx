import SubHeader from "@/components/global/SubHeader"
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14"
import Tabs from "@/components/ui/shadcn-io/TabesOfCD"

const CommunityDialogueProfilePage = () => {
    return (
        <>
        <Navbar14 />
        <div className="mt-4 ml-6"><SubHeader pageTitle={"Community Dialogue(Name)Profile"} ></SubHeader></div>


    <main className="w-fit ml-10 mt-10 mr-20">
      <Tabs tabs={["Home", "Group 1", "Settings", "Contact"]} />
    </main>
        </>
    )
}
export default CommunityDialogueProfilePage