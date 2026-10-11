import {readFile,mkdir,copyFile,writeFile} from 'node:fs/promises';import {spawnSync} from 'node:child_process';
const check=spawnSync(process.execPath,['--check','dist/app.js'],{encoding:'utf8'});if(check.status!==0)throw Error(check.stderr);
const html=await readFile('dist/index.html','utf8');for(const asset of ['style.css','app.js']){if(!html.includes(asset))throw Error('Missing '+asset);await readFile('dist/'+asset);}
const output='review/interaction-slice-1/build';await mkdir(output,{recursive:true});for(const asset of ['index.html','style.css','app.js'])await copyFile('dist/'+asset,output+'/'+asset);
console.log('BUILD PASS: buildless static site; 3 verified source assets copied to '+output);
