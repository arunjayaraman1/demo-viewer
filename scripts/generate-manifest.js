import fs from 'fs';
import path from 'path';

const projectsDir = path.join(process.cwd(), 'projects');
const publicDir = path.join(process.cwd(), 'public');
const manifestPath = path.join(publicDir, 'projects-manifest.json');
const publicProjectsDir = path.join(publicDir, 'projects');

try {
  // 1. Generate Projects Manifest
  console.log('Generating projects-manifest.json...');
  
  if (!fs.existsSync(projectsDir)) {
    console.error(`Projects directory not found at: ${projectsDir}`);
    process.exit(1);
  }

  const folders = fs.readdirSync(projectsDir).filter(file => {
    return fs.statSync(path.join(projectsDir, file)).isDirectory();
  });

  const manifest = [];

  for (const folder of folders) {
    const configPath = path.join(projectsDir, folder, 'project.json');
    let name = '';
    let slug = folder;
    let description = '';

    if (fs.existsSync(configPath)) {
      try {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const projectData = JSON.parse(configContent);
        name = projectData.name || '';
        slug = projectData.slug || folder;
        description = projectData.description || '';
      } catch (err) {
        console.error(`[Error] Failed to parse project.json in ${folder}:`, err.message);
      }
    }

    // Fallback: Guess name from folder slug if project.json is missing or empty
    if (!name) {
      name = folder
        .split(/[-_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    manifest.push({
      name,
      slug,
      description: description || 'Interactive client preview walkthrough.'
    });
    console.log(`- Loaded metadata for: ${slug} ("${name}")`);
  }

  // Ensure public folder exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Successfully generated projects-manifest.json with ${manifest.length} projects.`);

  // 2. Clean and Copy Projects to Public Projects Dir
  console.log('Copying projects to public/projects/...');
  
  if (fs.existsSync(publicProjectsDir)) {
    fs.rmSync(publicProjectsDir, { recursive: true, force: true });
  }
  
  fs.mkdirSync(publicProjectsDir, { recursive: true });

  // Copy directory helper
  const copyFolderSync = (from, to) => {
    fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
      const fromPath = path.join(from, element);
      const toPath = path.join(to, element);
      if (fs.lstatSync(fromPath).isDirectory()) {
        copyFolderSync(fromPath, toPath);
      } else {
        fs.copyFileSync(fromPath, toPath);
      }
    });
  };

  copyFolderSync(projectsDir, publicProjectsDir);
  console.log('Projects successfully copied to public/projects.');

} catch (error) {
  console.error("Error executing manifest generator:", error);
  process.exit(1);
}
