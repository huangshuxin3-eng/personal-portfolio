import {readFile,mkdir,copyFile} from 'node:fs/promises';import {spawnSync} from 'node:child_process';import {createRequire} from 'node:module';
const scripts=['dist/app.js','dist/hand-guide.js'];
const probe=spawnSync(process.execPath,['--check',scripts[0]],{encoding:'utf8'});
if(probe.error){
  // Some sandboxes forbid spawning node.exe. Fall back to an in-process parse with the workspace
  // TypeScript rather than silently skipping the syntax gate.
  const ts=createRequire(import.meta.url)('../../nonlit-workbench/node_modules/typescript');
  const program=ts.createProgram(scripts,{allowJs:true,noEmit:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
  const syntax=program.getSyntacticDiagnostics();
  if(syntax.length)throw Error(ts.flattenDiagnosticMessageText(syntax[0].messageText,'\n'));
  console.log('NOTE: node --check cannot spawn here; syntax verified in-process with the local TypeScript parser.');
}else for(const script of scripts){const check=spawnSync(process.execPath,['--check',script],{encoding:'utf8'});if(check.status!==0)throw Error(check.stderr);}
const assets=['style.css','app.js','hand-guide.css','hand-guide.js','retro-hand.svg'];
const html=await readFile('dist/index.html','utf8');for(const asset of assets){if(!html.includes(asset))throw Error('Missing '+asset);await readFile('dist/'+asset);}
const output='review/homepage-hand-sync/build';await mkdir(output,{recursive:true});for(const asset of ['index.html',...assets])await copyFile('dist/'+asset,output+'/'+asset);
console.log('BUILD PASS: buildless static site; 6 verified source assets copied to '+output);
