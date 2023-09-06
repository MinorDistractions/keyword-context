import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "keyword-context" is now active');

  interface Context {
    keyword: string;
    tooltip: string;
  }

  let keywordTooltips: Context[] = fetchKeywordTooltips();
  let sourceToggle: boolean = fetchSourceToggle();

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('keyword-context.map')) {
      keywordTooltips = fetchKeywordTooltips();
    }
    if (event.affectsConfiguration('keyword-context.source-toggle')) {
      sourceToggle = fetchSourceToggle();
    }
  });

  function fetchKeywordTooltips(): Context[] {
    return (
      vscode.workspace.getConfiguration('keyword-context').get('map') || []
    );
  }

  function fetchSourceToggle(): boolean {
    return !!vscode.workspace
      .getConfiguration('keyword-context')
      .get('source-toggle');
  }

  function findTooltipsByKeyword(keywordToFind: string): Context[] {
    const normalizedKeyword = keywordToFind.toLowerCase();
    return keywordTooltips.filter(
      (item) =>
        item.keyword.toLowerCase() === normalizedKeyword ||
        '.' + item.keyword.toLowerCase() === normalizedKeyword
    );
  }

  const hoverProvider = vscode.languages.registerHoverProvider('*', {
    provideHover(document, position) {
      const wordRange = document.getWordRangeAtPosition(position);
      const word = document.getText(wordRange);

      if (!word) return;

      const matchedTooltips = findTooltipsByKeyword(word);

      if (!matchedTooltips.length) return;

      const hoverText = new vscode.MarkdownString('', true);

      for (const tooltip of matchedTooltips) {
        hoverText.appendMarkdown(`- ${tooltip.tooltip}\n`);
      }

      if (sourceToggle) {
        hoverText.appendMarkdown('\n*(Keyword Context)*');
      }

      return new vscode.Hover(hoverText, wordRange);
    },
  });

  context.subscriptions.push(hoverProvider);
}
