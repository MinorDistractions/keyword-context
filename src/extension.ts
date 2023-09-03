import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "keyword-context" is now active');

  let keywordTooltips: { keyword: string; tooltip: string }[] | undefined;

  function findTooltipByKeyword(keywordToFind: string): string | undefined {
    keywordTooltips = vscode.workspace.getConfiguration('map').get('lookup');

    for (const item of keywordTooltips!) {
      if (
        item.keyword === keywordToFind ||
        '.' + item.keyword === keywordToFind
      ) {
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

      // console.log(`word: ${word}, tooltip: ${tooltip}`);

      if (tooltip) {
        const hoverRange = new vscode.Range(position, position);
        const hoverText = new vscode.MarkdownString(tooltip, true);

        return new vscode.Hover(
          hoverText.appendMarkdown(' *(Keyword Context)*'),
          hoverRange
        );
      }

      return undefined;
    },
  });

  context.subscriptions.push(hoverProvider);
}
