import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "keyword-context" is now active!'
  );

  let keywordTooltips: { keyword: string; tooltip: string }[] | undefined;

  function findTooltipByKeyword(keywordToFind: string): string | undefined {
    keywordTooltips = vscode.workspace.getConfiguration('map').get('lookup');

    console.log('keywordTooltips: ' + keywordTooltips);

    for (const item of keywordTooltips!) {
      if (item.keyword === keywordToFind) {
        return item.tooltip;
      }
    }
    return undefined;
  }

  const hoverProvider = vscode.languages.registerHoverProvider('*', {
    provideHover(document, position) {
      const wordRange = document.getWordRangeAtPosition(position);
      if (!wordRange) {
        return undefined;
      }

      const word = document.getText(wordRange);
      const tooltip = findTooltipByKeyword(word);

      console.log(`word: ${word}, tooltip: ${tooltip}`);

      if (tooltip) {
        const hoverRange = new vscode.Range(position, position);
        const hover = new vscode.Hover(
          tooltip + ' | Keyword Context',
          hoverRange
        );
        return hover;
      }

      return undefined;
    },
  });

  context.subscriptions.push(hoverProvider);
}
