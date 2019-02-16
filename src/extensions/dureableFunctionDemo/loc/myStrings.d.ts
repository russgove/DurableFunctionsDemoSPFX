declare interface IDureableFunctionDemoCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'DureableFunctionDemoCommandSetStrings' {
  const strings: IDureableFunctionDemoCommandSetStrings;
  export = strings;
}
