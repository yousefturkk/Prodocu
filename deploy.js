/**
 * Deployment script for Produco
 * Simple deployment automation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

function build() {
  console.log('Building Produco...');
  
  // No build step needed for vanilla JS
  console.log('Build complete (no build step required)');
  return true;
}

function deployToVercel() {
  console.log('Deploying to Vercel...');
  return runCommand('vercel --prod');
}

function deployToNetlify() {
  console.log('Deploying to Netlify...');
  return runCommand('netlify deploy --prod');
}

function createDist() {
  const distDir = path.join(__dirname, 'dist');
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }
  
  // Copy files to dist
  const files = ['index.html', 'app.js', 'styles.css'];
  files.forEach(file => {
    fs.copyFileSync(path.join(__dirname, file), path.join(distDir, file));
  });
  
  console.log('Dist directory created');
  return true;
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'build';
  
  switch (command) {
    case 'build':
      build();
      break;
    case 'deploy:vercel':
      build();
      deployToVercel();
      break;
    case 'deploy:netlify':
      build();
      deployToNetlify();
      break;
    case 'dist':
      createDist();
      break;
    default:
      console.log('Usage: node deploy.js [build|deploy:vercel|deploy:netlify|dist]');
  }
}

main();
