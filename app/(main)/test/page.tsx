import { Navbar14 } from "@/components/ui/shadcn-io/navbar-14";
import ChromeTabs from "../projects/Components/ChromeTab";

export default function Page() {
  return (
    <><Navbar14 /><ChromeTabs
      initialTabs={[
        { id: 0, title: "Project" },
        { id: 1, title: "mosa" },
        { id: 2, title: "sediqdsdf" },
      ]} /></>
  );
}
