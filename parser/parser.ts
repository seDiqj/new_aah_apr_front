import ShourtcutNode from "@/classes/ShourtcutNode";
import ShourtcutifyConstants from "@/constants/ShourtcutifyConstants";

class Parser {
  private flag: "group" | "experssion" | "arrow" | "or" | false = false;

  private graph: ShourtcutNode[][] = [];

  private shourtcutfyConstantsInstance: ShourtcutifyConstants =
    new ShourtcutifyConstants();

  //   ['(', 'a', ')', '->', '(', 'b', '|', 'x', ')']
  //   a->(b | (c|d))
  //   (a|b)
  //   (a->b)|c
  //   (a|b)->((b->c|(f)) | (d|h))
  //   (a|b->c);

  private parseArray(arr: string[]): void {
    this.graph.push([new ShourtcutNode("initNode", "init")]);

    let latestNode: ShourtcutNode = this.graph.at(-1)![0];

    let index: number = 1;

    arr.map((terminal: string) => {
      
    });
  }

  private handleGroup (group: string): ShourtcutNode[] {
    const brunches: ShourtcutNode[] = [];

    let latestNode: ShourtcutNode | null = null;
    
    Array.from(group).map((char: string) => {
      if (this.shourtcutfyConstantsInstance.isKeyAccToGrammer(char)) {
        if (latestNode) {
          (latestNode as ShourtcutNode).addChild(new ShourtcutNode('key', char));
        }
      }
    });
    return [];
  }
}
