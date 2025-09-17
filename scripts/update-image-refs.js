const fs = require('fs');
const path = require('path');

function updateImageReferences() {
  console.log('🔧 更新图片引用为 WebP 格式...');

  const projectRoot = path.join(__dirname, '..');
  let updatedFiles = 0;
  let totalReplacements = 0;

  function searchInDirectory(dir, extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'public' && file !== 'scripts') {
        searchInDirectory(filePath, extensions);
      } else if (stat.isFile() && extensions.some(ext => file.endsWith(ext))) {
        processFile(filePath);
      }
    }
  }

  function processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let newContent = content;
      let fileReplacements = 0;

      // 替换 extracted- 图片为 WebP
      const extractedRegex = /\/(extracted-[a-f0-9]+)\.png/g;
      newContent = newContent.replace(extractedRegex, (match, fileName) => {
        fileReplacements++;
        return `/${fileName}.webp`;
      });

      // 替换游戏图片为 WebP
      const gameImageRegex = /\/([a-z-]+-game)\.png/g;
      newContent = newContent.replace(gameImageRegex, (match, fileName) => {
        fileReplacements++;
        return `/${fileName}.webp`;
      });

      // 如果内容有变化，写回文件
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`📝 更新 ${path.relative(projectRoot, filePath)}: ${fileReplacements} 个图片引用`);
        updatedFiles++;
        totalReplacements += fileReplacements;
      }

    } catch (error) {
      console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
    }
  }

  // 搜索整个项目
  searchInDirectory(projectRoot);

  if (updatedFiles > 0) {
    console.log(`\n🎉 更新完成!`);
    console.log(`📊 更新文件: ${updatedFiles} 个`);
    console.log(`🔄 替换引用: ${totalReplacements} 个`);
    console.log(`\n✅ 所有图片引用已更新为 WebP 格式`);
  } else {
    console.log('✅ 没有需要更新的图片引用');
  }
}

updateImageReferences();