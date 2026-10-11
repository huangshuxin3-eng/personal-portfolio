import {readFile,mkdir,copyFile,writeFile} from 'node:fs/promises';import {spawnSync} from 'node:child_process';
for(const script of ['app.js','hand-guide.js']){const check=spawnSync(process.execPath,['--check','dist/'+script],{encoding:'utf8'});if(check.status!==0)throw Error(check.stderr);}
const assets=['style.css','app.js','hand-guide.css','hand-guide.js','retro-hand.svg'];
const html=await readFile('dist/index.html','utf8');for(const asset of assets){if(!html.includes(asset))throw Error('Missing '+asset);await readFile('dist/'+asset);}
const output='review/homepage-hand-integration/build';await mkdir(output,{recursive:true});for(const asset of ['index.html',...assets])await copyFile('dist/'+asset,output+'/'+asset);
console.log('BUILD PASS: buildless static site; 6 verified source assets copied to '+output);
