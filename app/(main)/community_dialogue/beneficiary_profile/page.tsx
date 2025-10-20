import SubHeader from "@/components/global/SubHeader";
import BeneProfileTabs from "@/components/ui/shadcn-io/BeneProfileTab";
import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";

const BeneficiaryProfilePage = () => {
  return (
    <>
      <Navbar14 />
      <div className="mt-4 ml-6">
        <SubHeader pageTitle={"Beneficiay Profile"} />
      </div>
      <main className="ml-10 mt-10 mr-20">
        <BeneProfileTabs tabs={["Beneficiary Info", "Community Dialogue"]} />
      </main>
    </>
  );
};
export default BeneficiaryProfilePage;
