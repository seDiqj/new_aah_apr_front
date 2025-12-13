class ShourtcutNode {
  private type: string;
  private value: string;
  private childNodes: ShourtcutNode[];

  constructor(
    type: string,
    value: string,
    childNodes?: ShourtcutNode[]
  ) {
    this.type = type;
    this.value = value;
    this.childNodes = childNodes ?? [];
  }

  public addChild(child: ShourtcutNode): void {
    this.childNodes.push(child);
  }

  public removeLatestChild(): void {
    this.childNodes.pop();
  }

  public hasAnyChild(): boolean {
    return this.childNodes.length >= 1;
  }
}

export default ShourtcutNode;
