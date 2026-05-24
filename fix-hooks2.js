/**
 * Fix hook insertion - handles multi-line function declarations properly.
 */
const fs = require('fs');
const path = require('path');

const allFiles = [
  'src/components/ParamControls.js',
  'src/components/TTSControls.js',
  'src/components/VideoParamControls.js',
  'src/components/ApiKeyDropdown.js',
  'src/components/ResizableTextInput.js',
  'src/components/UserInfoCard.js',
];

const multiComponentFiles = new Set([
  'src/components/ParamControls.js',
  'src/components/VideoParamControls.js',
]);

for (const relPath of allFiles) {
  const filePath = path.join(__dirname, relPath);
  let code = fs.readFileSync(filePath, 'utf8');

  // Check if hooks are already present
  if (code.includes('const { styles, colors } = useStyles();') || code.includes('const styles = useThemedStyles(createStyles)')) {
    console.log(`  Skipping (hooks already present): ${relPath}`);
    continue;
  }

  const isMulti = multiComponentFiles.has(relPath);
  const hookLine = isMulti
    ? '  const { styles, colors } = useStyles();'
    : '  const styles = useThemedStyles(createStyles);\n  const { colors } = useTheme();';

  // Strategy: find all function body opening braces and insert hooks after them
  // We need to distinguish function body { from destructuring { in params

  const lines = code.split(/\r?\n/);
  const result = [];
  let inFuncDecl = false; // tracking multi-line function declaration
  let braceDepth = 0; // depth of braces inside function params

  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i]);
    const trimmed = lines[i].trimEnd();

    // Detect start of export function declaration
    if (/^export\s+function\s+\w+/.test(trimmed)) {
      // Check if the function body { is on this same line
      // Count parens and braces to find the function body opening
      const afterFuncName = trimmed.replace(/^export\s+function\s+\w+\s*/, '');
      
      // Simple check: if line ends with just { (not ({ or ) {)
      // Actually, let's track properly
      let parenDepth = 0;
      let foundOpenParen = false;
      let funcBodyOpened = false;
      
      for (const ch of afterFuncName) {
        if (ch === '(') { parenDepth++; foundOpenParen = true; }
        if (ch === ')') parenDepth--;
        if (foundOpenParen && parenDepth === 0 && ch === '{') {
          funcBodyOpened = true;
          break;
        }
      }
      
      if (funcBodyOpened) {
        // Function body { is on this line, add hooks
        result.push(hookLine);
      } else {
        // Function declaration continues on next lines
        inFuncDecl = true;
        braceDepth = 0;
      }
      continue;
    }

    if (inFuncDecl) {
      // Track paren/brace depth to find the function body opening
      for (const ch of trimmed) {
        if (ch === '(') { /* ignore, we're past the function name */ }
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      }
      
      // The function body opens when we see ) { or }) {
      // i.e., after the closing paren of the params, the next { is the body
      // We detect this when braceDepth becomes 0 after a } and we see {
      // OR when the line is "}) {" or ") {"
      
      if (/^\}\)\s*\{/.test(trimmed) || /^\)\s*\{/.test(trimmed)) {
        result.push(hookLine);
        inFuncDecl = false;
      } else if (trimmed === '{' && braceDepth === 0) {
        // Just a lone { at brace depth 0 after params
        result.push(hookLine);
        inFuncDecl = false;
      }
    }
  }

  code = result.join('\n');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log(`✓ Fixed hooks: ${relPath}`);
}

console.log('Done!');
