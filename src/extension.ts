import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "keyword-context" is now active');

  interface KeywordTooltip {
    keyword: string;
    tooltip: string;
  }

  let keywordTooltips: KeywordTooltip[] = fetchKeywordTooltips();
  let sourceToggle: boolean = fetchSourceToggle();

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('keyword-context.map')) {
      keywordTooltips = fetchKeywordTooltips();
    }
    if (event.affectsConfiguration('keyword-context.source-toggle')) {
      sourceToggle = fetchSourceToggle();
    }
  });

  function fetchKeywordTooltips(): KeywordTooltip[] {
    return (
      vscode.workspace.getConfiguration('keyword-context').get('map') || []
    );
  }

  function fetchSourceToggle(): boolean {
    return !!vscode.workspace
      .getConfiguration('keyword-context')
      .get('source-toggle');
  }

  function findTooltipByKeyword(keywordToFind: string): string | undefined {
    const normalizedKeyword = keywordToFind.toLowerCase();
    return keywordTooltips.find(
      (item) =>
        item.keyword.toLowerCase() === normalizedKeyword ||
        '.' + item.keyword.toLowerCase() === normalizedKeyword
    )?.tooltip;
  }

  const hoverProvider = vscode.languages.registerHoverProvider('*', {
    provideHover(document, position) {
      const wordRange = document.getWordRangeAtPosition(position);
      const word = document.getText(wordRange);

      if (!word) return;

      const tooltip = findTooltipByKeyword(word);
      if (!tooltip) return;

      const hoverText = new vscode.MarkdownString(tooltip, true);

      if (sourceToggle) {
        hoverText.appendMarkdown(' *(Keyword Context)*');
      }

      return new vscode.Hover(hoverText, wordRange);
    },
  });

  context.subscriptions.push(hoverProvider);
}
