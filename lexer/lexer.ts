class Lexer {
  private shouldBePass: boolean = false;

  private getStringPrimeryCharsList(str: string): any[] {
    const strArray: string[] = Array.from(str);

    const manipulatedArray: any[] = strArray.map(
      (char: string, index: number) => {
        if (this.shouldBePass) {
            this.shouldBePass = false;
            return null;
        };
        if (char == "-") {
          if (!(strArray[index + 1] == ">")) {
            console.log(
              `syntax error: expected -> but -${strArray[index + 1]} inserted`
            );
            return null;
          }

          this.shouldBePass = true;
          return "->";
        }

        return char;
      }
    );

    return manipulatedArray.filter((item) => item != null);
  }

  public getFullyString = (str: string) => this.getStringPrimeryCharsList(str);
}


export default Lexer;