const fs = require('fs');
const path = require('path');

function extractBase64Images() {
  console.log('🔍 搜索项目中的 base64 图片...');

  const projectRoot = path.join(__dirname, '..');
  const publicDir = path.join(projectRoot, 'public');

  // 确保 public 目录存在
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let extractedCount = 0;
  let totalSaved = 0;

  function searchInDirectory(dir, extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'public') {
        searchInDirectory(filePath, extensions);
      } else if (stat.isFile() && extensions.some(ext => file.endsWith(ext))) {
        processFile(filePath);
      }
    }
  }

  function processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const base64Regex = /data:image\/(png|jpg|jpeg|gif|webp);base64,([A-Za-z0-9+/=]+)/g;

      let match;
      let newContent = content;

      while ((match = base64Regex.exec(content)) !== null) {
        const [fullMatch, format, base64Data] = match;
        const buffer = Buffer.from(base64Data, 'base64');
        const sizeKB = Math.round(buffer.length / 1024);

        // 生成文件名
        const hash = require('crypto').createHash('md5').update(base64Data).digest('hex').substring(0, 8);
        const fileName = `extracted-${hash}.${format}`;
        const outputPath = path.join(publicDir, fileName);

        // 写入文件
        fs.writeFileSync(outputPath, buffer);

        // 替换原始 base64 为文件路径
        newContent = newContent.replace(fullMatch, `/${fileName}`);

        console.log(`✅ 提取: ${fileName} (${sizeKB}KB) 从 ${path.relative(projectRoot, filePath)}`);

        extractedCount++;
        totalSaved += buffer.length;
      }

      // 如果内容有变化，写回文件
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`📝 更新文件: ${path.relative(projectRoot, filePath)}`);
      }

    } catch (error) {
      console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
    }
  }

  // 搜索整个项目
  searchInDirectory(projectRoot);

  if (extractedCount > 0) {
    console.log(`\n🎉 提取完成!`);
    console.log(`📊 总计提取: ${extractedCount} 个图片`);
    console.log(`💾 节省内存: ${Math.round(totalSaved / 1024 / 1024 * 100) / 100}MB`);
    console.log(`\n🔧 下一步:`);
    console.log(`1. 运行 npm run optimize:images 优化这些图片`);
    console.log(`2. 检查代码中的图片引用是否正确`);
  } else {
    console.log('✅ 未发现 base64 图片');
  }
}

extractBase64Images();